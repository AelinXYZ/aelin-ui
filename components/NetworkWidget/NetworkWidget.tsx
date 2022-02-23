import { FC, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Image from 'next/image';
import { ethers, BigNumber } from 'ethers';

import Dropdown from 'components/Dropdown';
import { FlexDivCentered } from 'components/common';

import Connector from 'containers/Connector';

import ROUTES from 'constants/routes';

import OptimismLogo from 'assets/svg/optimism-logo.svg';
import EthereumLogo from 'assets/svg/ethereum-logo.svg';

import {
	L2_TO_L1_NETWORK_MAPPER,
	L1_TO_L2_NETWORK_MAPPER,
	OPTIMISM_NETWORKS,
} from '@synthetixio/optimism-networks';
import { NetworkId } from 'constants/networks';

const CHAINS = [
	{
		label: 'Ethereum',
		img: EthereumLogo,
	},
	{
		label: 'Optimism',
		img: OptimismLogo,
	},
];

type Chain = {
	label: string;
	img: string;
};

const getCorrespondingNetwork = (networkId: NetworkId, isOVM: boolean) => {
	if (isOVM) {
		return (
			L2_TO_L1_NETWORK_MAPPER[networkId] || L2_TO_L1_NETWORK_MAPPER[NetworkId['Optimism-Mainnet']]
		);
	} else {
		return L1_TO_L2_NETWORK_MAPPER[networkId] || L1_TO_L2_NETWORK_MAPPER[NetworkId.Mainnet];
	}
};

const NetworkWidget: FC = () => {
	const router = useRouter();
	const { asPath, query } = router;

	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const { isOVM, provider, network, walletAddress } = Connector.useContainer();
	const [chain, setChain] = useState<Chain>(CHAINS[0]);

	useEffect(() => {
		const chain = CHAINS[isOVM ? 1 : 0];
		setChain(chain);
	}, [isOVM]);

	const checkRouteAndRedirect = useCallback(() => {
		// @ts-ignore: missing nested field type
		if (asPath !== ROUTES.Pools.PoolView(query.address)) return;
		router.push(ROUTES.Pools.Home);
	}, [asPath, query.address, router]);

	const handleSwitchChain = useCallback(async () => {
		if (!provider || !network?.id || !walletAddress) return;
		const web3Provider = provider as ethers.providers.Web3Provider;
		if (!web3Provider.provider || !web3Provider.provider.request) return;
		const newNetworkId = getCorrespondingNetwork(network?.id, isOVM);
		const formattedChainId = ethers.utils.hexStripZeros(BigNumber.from(newNetworkId).toHexString());
		try {
			await web3Provider.provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: formattedChainId }],
			});
		} catch (e) {
			if (e?.message?.includes('Unrecognized chain ID')) {
				await web3Provider.provider.request({
					method: 'wallet_addEthereumChain',
					params: [OPTIMISM_NETWORKS[newNetworkId]],
				});
			}
		}

		checkRouteAndRedirect();
	}, [isOVM, provider, network?.id, walletAddress, checkRouteAndRedirect]);

	const ChainList = (
		<List>
			{CHAINS.map((chain: Chain, i: Number) => (
				<ListElement
					key={`listElement-${i}`}
					onClick={() => {
						if ((isOVM && chain.label !== 'Optimism') || (!isOVM && chain.label !== 'Ethereum')) {
							handleSwitchChain();
						}
					}}
				>
					<ChainElement>
						<StyledImage src={chain.img} />
						<ChainLabel>{chain.label}</ChainLabel>
					</ChainElement>
				</ListElement>
			))}
		</List>
	);
	return (
		<Dropdown
			isEnabled={!!walletAddress}
			isOpen={isDropdownOpen}
			setIsOpen={setIsDropdownOpen}
			content={ChainList}
		>
			<FlexDivCentered>
				<ChainElement>
					<StyledImage src={chain.img} />
					<ChainLabel>{chain.label}</ChainLabel>
				</ChainElement>
			</FlexDivCentered>
		</Dropdown>
	);
};

const StyledImage = styled(Image)`
	width: 20px;
	height: 20px;
	margin-right: 4px;
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	width: 100%;
`;

const ListElement = styled.li`
	width: 100%;
	padding: 12px;
	cursor: pointer;
	&:hover {
		background-color: ${(props) => props.theme.colors.inputBorders};
	}
`;

const ChainElement = styled(FlexDivCentered)`
	align-items: center;
`;

const ChainLabel = styled.span`
	margin-left: 8px;
	font-size: 1rem;
`;

export default NetworkWidget;

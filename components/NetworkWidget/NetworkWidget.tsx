import { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import Dropdown from 'components/Dropdown';
import { FlexDivCentered } from 'components/common';

import Connector from 'containers/Connector';

import OptimismLogo from 'assets/svg/optimism-logo.svg';
import EthereumLogo from 'assets/svg/ethereum-logo.svg';

import { switchToL1, switchToL2, OPTIMISM_NETWORKS } from '@synthetixio/optimism-networks';

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

const NetworkWidget: FC = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const { isOVM } = Connector.useContainer();
	const [chain, setChain] = useState<Chain>(CHAINS[0]);

	useEffect(() => {
		const chain = CHAINS[isOVM ? 1 : 0];
		setChain(chain);
	}, [isOVM]);

	const switchChain = useCallback(async () => {
		if (!window.ethereum) return;
		const switchChainFunc = isOVM ? switchToL1 : switchToL2;
		await switchChainFunc({ ethereum: window.ethereum });
	}, [isOVM]);

	const ChainList = (
		<List>
			{CHAINS.map((chain: Chain, i: Number) => (
				<ListElement key={`listElement-${i}`} onClick={switchChain}>
					<ChainElement>
						<StyledImage src={chain.img} />
						<ChainLabel>{chain.label}</ChainLabel>
					</ChainElement>
				</ListElement>
			))}
		</List>
	);
	return (
		<Dropdown isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} content={ChainList}>
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
		background-color: #c1bfbf;
	}
`;

const ChainElement = styled(FlexDivCentered)`
	align-items: center;
`;

const ChainLabel = styled.span`
	margin-left: 8px;
	font-size: 12px;
`;

export default NetworkWidget;

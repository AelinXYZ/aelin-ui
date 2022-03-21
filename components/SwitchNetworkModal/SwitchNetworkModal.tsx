import { ethers, BigNumber } from 'ethers';
import styled from 'styled-components';
import { PoolCreatedResult } from 'subgraph';
import { FC, useState, useCallback, useEffect } from 'react';
import { OPTIMISM_NETWORKS } from '@synthetixio/optimism-networks';

import Connector from 'containers/Connector';

import Button from 'components/Button';
import BaseModal from 'components/BaseModal';

import { nameToIdMapping } from 'constants/networks';

interface PoolProps extends PoolCreatedResult {
	duration: number;
	purchaseExpiry: number;
	timestamp: number;
}

interface SwitchNetworkModalProps {
	pool: PoolProps | null;
	poolNetwork: string | null;
	isPoolLoaded: boolean;
}

const SwitchNetworkModal: FC<SwitchNetworkModalProps> = ({ pool, poolNetwork, isPoolLoaded }) => {
	const { network, walletAddress, provider } = Connector.useContainer();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const poolNetworkId = nameToIdMapping[poolNetwork ?? '']?.id ?? '';

	useEffect(() => {
		if (pool === null && isPoolLoaded && network.id !== poolNetworkId) {
			setIsModalOpen(true);
		} else {
			setIsModalOpen(false);
		}
	}, [isPoolLoaded, network.id, pool, poolNetworkId]);

	const handleSwitchChain = useCallback(async () => {
		if (!provider) {
			return;
		}
		const web3Provider = provider as ethers.providers.Web3Provider;
		if (!web3Provider.provider || !web3Provider.provider.request) {
			return;
		}
		const formattedChainId = ethers.utils.hexStripZeros(
			BigNumber.from(poolNetworkId).toHexString()
		);

		try {
			await web3Provider.provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: formattedChainId }],
			});

			if (!walletAddress) {
				window.location.reload();
			}
		} catch (e) {
			if (e?.message?.includes('Unrecognized chain ID')) {
				await web3Provider.provider.request({
					method: 'wallet_addEthereumChain',
					params: [OPTIMISM_NETWORKS[poolNetworkId]],
				});
			}
		}
	}, [poolNetworkId, provider, walletAddress]);

	return (
		<BaseModal
			onClose={() => setIsModalOpen(false)}
			title="Switch Networks"
			setIsModalOpen={setIsModalOpen}
			isModalOpen={isModalOpen}
		>
			<ModalContainer>
				<p>We noticed you are connected to the wrong network for this pool.</p>
				{poolNetwork != null ? (
					<>
						<p>{`Please switch to ${poolNetwork} in order to see this pool`}</p>
						<br />
						<Button variant="primary" isRounded onClick={handleSwitchChain}>
							<StyledText>{`Switch to ${poolNetwork}`}</StyledText>
						</Button>
					</>
				) : (
					<>
						<p>Please use the network tab in the top right to switch networks.</p>
					</>
				)}
			</ModalContainer>
		</BaseModal>
	);
};

const StyledText = styled.span`
	font-size: 1rem;
	font-family: ${(props) => props.theme.fonts.ASMRegular};
`;

const ModalContainer = styled.div`
	text-align: center;
`;

export default SwitchNetworkModal;

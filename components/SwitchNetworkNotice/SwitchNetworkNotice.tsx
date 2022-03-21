import { OPTIMISM_NETWORKS } from '@synthetixio/optimism-networks';
import Button from 'components/Button';
import { nameToIdMapping } from 'constants/networks';
import Connector from 'containers/Connector';
import { BigNumber, ethers } from 'ethers';
import router from 'next/router';
import { useCallback } from 'react';
import styled from 'styled-components';

const SwitchNetworkNotice = () => {
	const { poolData } = router.query;

	const poolNetwork =
		poolData && poolData.length > 1 && Object.keys(nameToIdMapping).indexOf(poolData[1]) !== -1
			? poolData[1]
			: null;

	const poolNetworkId = poolNetwork ? nameToIdMapping[poolNetwork]?.id ?? '' : null;
	const { provider } = Connector.useContainer();

	const handleSwitchChain = useCallback(async () => {
		if (!provider || !poolNetworkId) {
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
		} catch (e) {
			if (e?.message?.includes('Unrecognized chain ID')) {
				await web3Provider.provider.request({
					method: 'wallet_addEthereumChain',
					params: [OPTIMISM_NETWORKS[poolNetworkId]],
				});
			}
		}
	}, [poolNetworkId, provider]);

	return (
		<Container>
			<p>
				We noticed you are connected to the wrong network for this pool. Please switch to optimism
				in order to see this pool
			</p>
			<Button size="md" variant="primary" type="submit" onClick={handleSwitchChain} isRounded>
				Switch to {poolNetwork}
			</Button>
		</Container>
	);
};

export default SwitchNetworkNotice;

const Container = styled.div`
	width: 720px;
	background-color: ${(props) => props.theme.colors.secondary};
	color: ${(props) => props.theme.colors.red};
	border: 1px solid ${(props) => props.theme.colors.red};
	border-radius: 8px;
	padding: 25px 30px;
	margin: auto;
	margin-top: 5%;
`;

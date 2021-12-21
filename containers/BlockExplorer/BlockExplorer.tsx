import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { keys } from 'lodash';
import { OPTIMISM_NETWORKS } from '@synthetixio/optimism-networks';

import { NetworkId, NetworkType } from 'constants/networks';
import Connector from 'containers/Connector';

type BlockExplorerInstance = {
	txLink: (txId: string) => string;
	addressLink: (address: string) => string;
	tokenLink: (address: string) => string;
	blockLink: (blockNumber: string) => string;
	messageRelayer: (txId: string) => string;
};

const getBaseUrl = (network: NetworkType, isOVM: boolean) => {
	if (isOVM) {
		return (
			OPTIMISM_NETWORKS[network.id]?.blockExplorerUrls[0] ??
			OPTIMISM_NETWORKS[keys(OPTIMISM_NETWORKS)[0] as any].blockExplorerUrls[0]
		);
	} else if (network.id === NetworkId.Mainnet) {
		return 'https://etherscan.io';
	}
	return `https://${network.name}.etherscan.io`;
};

const generateExplorerFunctions = (baseUrl: string) => {
	return {
		txLink: (txId: string) => `${baseUrl}/tx/${txId}`,
		addressLink: (address: string) => `${baseUrl}/address/${address}`,
		tokenLink: (address: string) => `${baseUrl}/token/${address}`,
		blockLink: (blockNumber: string) => `${baseUrl}/block/${blockNumber}`,
		messageRelayer: (txId: string) => `${baseUrl}/messagerelayer?search=${txId}`,
	};
};

const useBlockExplorer = () => {
	const { network, isOVM } = Connector.useContainer();

	const [blockExplorerInstance, setBlockExplorerInstance] = useState<BlockExplorerInstance | null>(
		null
	);

	useEffect(() => {
		if (network) {
			const baseUrl = getBaseUrl(network, isOVM);
			console.log('base url', baseUrl);
			setBlockExplorerInstance(generateExplorerFunctions(baseUrl));
		}
	}, [network, isOVM]);

	return {
		blockExplorerInstance,
	};
};

const BlockExplorer = createContainer(useBlockExplorer);

export default BlockExplorer;

import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import _ from 'lodash';

import Connector, { NetworkType } from 'containers/Connector';

type BlockExplorerInstance = {
	txLink: (txId: string) => string;
	addressLink: (address: string) => string;
	tokenLink: (address: string) => string;
	blockLink: (blockNumber: string) => string;
	messageRelayer: (txId: string) => string;
};

const getBaseUrl = (network: NetworkType) => {
	// TODO fix NetworkId import issue
	if (network.id === 1) {
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
	const { network } = Connector.useContainer();

	const [blockExplorerInstance, setBlockExplorerInstance] = useState<BlockExplorerInstance | null>(
		null
	);

	useEffect(() => {
		if (network) {
			const baseUrl = getBaseUrl(network);
			setBlockExplorerInstance(generateExplorerFunctions(baseUrl));
		}
	}, [network]);

	return {
		blockExplorerInstance,
	};
};

const BlockExplorer = createContainer(useBlockExplorer);

export default BlockExplorer;

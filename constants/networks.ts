import Wei from '@synthetixio/wei';

export enum Network {
	Mainnet = 'mainnet',
	Kovan = 'kovan',
	Goerli = 'goerli',
	'Optimism-Mainnet' = 'optimism-mainnet',
	'Optimism-Kovan' = 'optimism-kovan',
}

export enum NetworkId {
	Mainnet = 1,
	Kovan = 42,
	Goerli = 5,
	'Optimism-Mainnet' = 10,
	'Optimism-Kovan' = 69,
}

export type NetworkType = {
	id: NetworkId;
	name: Network;
};

export const chainIdMapping = {
	[NetworkId.Mainnet]: Network.Mainnet,
	[NetworkId.Kovan]: Network.Kovan,
	[NetworkId.Goerli]: Network.Goerli,
	[NetworkId['Optimism-Mainnet']]: Network['Optimism-Mainnet'],
	[NetworkId['Optimism-Kovan']]: Network['Optimism-Kovan'],
};

export const GWEI_PRECISION = 9;
export const GWEI_UNIT = 1000000000;
export type GasLimitEstimate = Wei | null;

export const isMainnet = (networkId: NetworkId) =>
	[NetworkId.Mainnet, NetworkId['Optimism-Mainnet']].includes(networkId);

export const nameToIdMapping: { [name: string]: { id: number; isMainnet: boolean } } = {
	mainnet: {
		id: 1,
		isMainnet: true,
	},
	kovan: {
		id: 42,
		isMainnet: false,
	},
	goerli: {
		id: 5,
		isMainnet: false,
	},
	optimism: {
		id: 10,
		isMainnet: true,
	},
	'optimism-kovan': {
		id: 69,
		isMainnet: false,
	},
};

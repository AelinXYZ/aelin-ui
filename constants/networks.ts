import Wei from '@synthetixio/wei';

export enum Network {
	Mainnet = 'mainnet',
	Kovan = 'kovan',
	'Mainnet-ovm' = 'optimism-mainnet',
	'Optimism-Kovan' = 'optimism-kovan',
}

export enum NetworkId {
	Mainnet = 1,
	Kovan = 42,
	'Mainnet-ovm' = 10,
	'Optimism-Kovan' = 69,
}

export type NetworkType = {
	id: NetworkId;
	name: Network;
};

export const chainIdMapping = {
	[NetworkId.Mainnet]: Network.Mainnet,
	[NetworkId.Kovan]: Network.Kovan,
	[NetworkId['Mainnet-ovm']]: Network['Mainnet-ovm'],
	[NetworkId['Optimism-Kovan']]: Network['Optimism-Kovan'],
};

export const GWEI_PRECISION = 9;
export const GWEI_UNIT = 1000000000;
export type GasLimitEstimate = Wei | null;

export const isMainnet = (networkId: NetworkId) =>
	[NetworkId.Mainnet, NetworkId['Mainnet-ovm']].includes(networkId);

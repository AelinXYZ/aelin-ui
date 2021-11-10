export enum Network {
	Mainnet = 'mainnet',
	Ropsten = 'ropsten',
	Rinkeby = 'rinkeby',
	Goerli = 'goerli',
	Kovan = 'kovan',
}

export enum NetworkId {
	Mainnet = 1,
	Ropsten = 3,
	Rinkeby = 4,
	Goerli = 5,
	Kovan = 42,
}

export type NetworkType = {
	id: NetworkId;
	name: Network;
};

export const chainIdMapping = {
	[NetworkId.Mainnet]: Network.Mainnet,
	[NetworkId.Goerli]: Network.Goerli,
	[NetworkId.Kovan]: Network.Kovan,
	[NetworkId.Rinkeby]: Network.Rinkeby,
	[NetworkId.Ropsten]: Network.Kovan,
};

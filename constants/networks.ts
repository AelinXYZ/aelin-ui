import { NetworkId, Network as NetworkName } from '@synthetixio/contracts-interface';

export const chainIdMapping = {
	[NetworkId.Mainnet]: NetworkName.Mainnet,
	[NetworkId.Goerli]: NetworkName.Goerli,
	[NetworkId.Kovan]: NetworkName.Kovan,
	[NetworkId.Ropsten]: NetworkName.Ropsten,
	[NetworkId.Rinkeby]: NetworkName.Rinkeby,
};

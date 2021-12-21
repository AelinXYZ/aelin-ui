import { NetworkId } from './networks';

export const GRAPH_ENDPOINT_MAINNET = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin';
export const GRAPH_ENDPOINT_OPTIMISM = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/optimism';
export const ETH_GAS_STATION_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
export const GAS_NOW_API_URL = 'https://etherchain.org/api/gasnow';

export const getGraphEndpoint = (networkId?: NetworkId) => {
	if (networkId === NetworkId['Mainnet-ovm']) {
		return GRAPH_ENDPOINT_OPTIMISM;
	}
	return GRAPH_ENDPOINT_MAINNET;
};

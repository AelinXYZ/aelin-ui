import { NetworkId } from './networks';

export const GRAPH_ENDPOINT_MAINNET = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin-mainnet';
export const GRAPH_ENDPOINT_OPTIMISM = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin-optimism';
export const GRAPH_ENDPOINT_KOVAN = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin-kovan';
export const ETH_GAS_STATION_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
export const GAS_NOW_API_URL = 'https://etherchain.org/api/gasnow';

export const getGraphEndpoint = (networkId?: NetworkId) => {
	if (networkId === NetworkId['Optimism-Mainnet']) {
		return GRAPH_ENDPOINT_OPTIMISM;
	} else if (networkId === NetworkId.Kovan) {
		return GRAPH_ENDPOINT_KOVAN;
	}
	return GRAPH_ENDPOINT_MAINNET;
};

import { NetworkId } from './networks';

export const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin';
export const GRAPH_ENDPOINT_OPTIMISM = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/optimism';
export const ETH_GAS_STATION_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
export const GAS_NOW_API_URL = 'https://www.gasnow.org/api/v3/gas/price?utm_source=kwenta';

export const getGraphEndpoint = (networkId?: NetworkId) => {
	if (networkId === NetworkId.Mainnet) {
		return GRAPH_ENDPOINT_OPTIMISM;
	}
	return GRAPH_ENDPOINT;
};

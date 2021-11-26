import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import { NetworkId } from 'constants/networks';
import { formatGwei } from 'utils/crypto';
import { ETH_GAS_STATION_API_URL, GAS_NOW_API_URL } from 'constants/endpoints'

import {GasSpeed, GasPrices} from 'components/GasSelector/types'

export const GAS_SPEEDS: GasSpeed[] = ['average', 'fast', 'fastest'];

type EthGasStationResponse = {
	average: number;
	avgWait: number;
	blockNum: number;
	block_time: number;
	fast: number;
	fastWait: number;
	fastest: number;
	fastestWait: number;
	gasPriceRange: Record<number, number>;
	safeLow: number;
	safeLowWait: number;
	speed: number;
};

type GasNowResponse = {
	code: number;
	data: {
		rapid: number;
		fast: number;
		standard: number;
		slow: number;
		timestamp: number;
	};
};

type Network = {
  networkId: number;
  provider: any;
}

const useEthGasPriceQuery = (network: Network, options?: UseQueryOptions<GasPrices, Error>) => {
  const { networkId, provider } = network;

	return useQuery<GasPrices, Error>(
		['network', 'gasPrice', networkId],
		async () => {
			if (networkId === NetworkId.Mainnet) {
				try {
					const result = await axios.get<GasNowResponse>(GAS_NOW_API_URL);
					const { standard, fast, rapid: fastest } = result.data.data;

					return {
						fastest: Math.round(formatGwei(fastest)),
						fast: Math.round(formatGwei(fast)),
						average: Math.round(formatGwei(standard)),
					};
				} catch (e) {
					const result = await axios.get<EthGasStationResponse>(ETH_GAS_STATION_API_URL);
					const { average, fast, fastest } = result.data;

					return {
						fastest: Math.round(fastest / 10),
						fast: Math.round(fast / 10),
						average: Math.round(average / 10),
					};
				}
			}

			try {
				const gasPrice = formatGwei((await provider!.getGasPrice()).toNumber());

				return {
					fastest: gasPrice,
					fast: gasPrice,
					average: gasPrice,
				};
			} catch (e) {
				throw new Error('Cannot retrieve optimistic gas price from provider. ' + e);
			}
		},
		{
			enabled: !!networkId,
			...options,
		}
	);
};

export default useEthGasPriceQuery;
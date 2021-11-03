import { UseQueryOptions, useQuery } from 'react-query';
import { gql, request } from 'graphql-request';
import { utils } from 'ethers';
import QUERY_KEYS from 'constants/queryKeys';
import Wei, { wei } from '@synthetixio/wei';

import { GRAPH_ENDPOINT } from 'constants/endpoints';

type Pool = {
	address: string;
	timestamp: number;
	name: string;
	symbol: string;
	duration: number;
	purchaseToken: string;
	purchaseExpiry: number;
	purchaseTokenCap: Wei;
	sponsor: string;
	sponsorFee: number;
};

const useGetPoolsQuery = (options?: UseQueryOptions<Pool[]>) => {
	return useQuery<Pool[]>(
		QUERY_KEYS.Pools,
		async () => {
			const response = await request(
				GRAPH_ENDPOINT,
				gql`
					{
						poolCreateds(orderBy: timestamp) {
							id
							name
							symbol
							purchaseTokenCap
							purchaseToken
							duration
							sponsorFee
							sponsor
							purchaseExpiry
							timestamp
						}
					}
				`
			);

			return response?.poolCreateds.map(
				({
					id,
					timestamp,
					name,
					symbol,
					duration,
					purchaseToken,
					purchaseExpiry,
					purchaseTokenCap,
					sponsor,
					sponsorFee,
				}: any) => ({
					address: id,
					timestamp: Number(timestamp) * 1000,
					name: utils.parseBytes32String(name.split('-')[1]),
					symbol: utils.parseBytes32String(symbol.split('-')[1]),
					duration: Number(duration) * 1000,
					purchaseToken: purchaseToken,
					purchaseExpiry: Number(purchaseExpiry) * 1000,
					purchaseTokenCap: wei(purchaseTokenCap.toString()),
					sponsor: sponsor,
					sponsorFee: Number(sponsorFee) / 100,
				})
			);
		},
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			...options,
		}
	);
};

export default useGetPoolsQuery;

import { utils } from 'ethers';
import Wei, { wei } from '@synthetixio/wei';

import { GRAPH_ENDPOINT } from 'constants/endpoints';
import { MAX_RESULTS_PER_PAGE } from 'constants/defaults';
import { useGetPoolCreateds, PoolCreatedResult } from '../../subgraph';

export enum GQLDirection {
	GT = 'gt',
	LT = 'lt',
}

type GetPoolsQueryArgs = {
	timestamp: number;
	direction: GQLDirection;
};

const useGetPoolsQuery = ({ timestamp, direction }: GetPoolsQueryArgs) => {
	const where =
		direction === GQLDirection.GT ? { timestamp_gt: timestamp } : { timestamp_lt: timestamp };
	return useGetPoolCreateds(
		GRAPH_ENDPOINT,
		{
			first: MAX_RESULTS_PER_PAGE,
			orderBy: 'timestamp',
			orderDirection: 'desc',
			where,
		},
		{
			id: true,
			name: true,
			symbol: true,
			purchaseTokenCap: true,
			purchaseToken: true,
			duration: true,
			sponsorFee: true,
			sponsor: true,
			purchaseExpiry: true,
			timestamp: true,
		}
	);
};

export const parsePools = (poolData?: PoolCreatedResult[]) => {
	return (poolData ?? []).map(
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
};

export default useGetPoolsQuery;

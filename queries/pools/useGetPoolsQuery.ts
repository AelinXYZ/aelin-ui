import { utils } from 'ethers';
import { wei } from '@synthetixio/wei';

import { GRAPH_ENDPOINT } from 'constants/endpoints';
import { useGetPoolCreateds, PoolCreatedResult } from '../../subgraph';

const useGetPoolsQuery = () => {
	return useGetPoolCreateds(
		GRAPH_ENDPOINT,
		{
			orderBy: 'timestamp',
			orderDirection: 'desc',
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
			poolStatus: true,
			purchaseDuration: true,
		}
	);
};

export const parsePool = ({
	id,
	timestamp,
	name,
	symbol,
	duration,
	purchaseToken,
	purchaseExpiry,
	purchaseDuration,
	purchaseTokenCap,
	sponsor,
	sponsorFee,
	poolStatus,
}: PoolCreatedResult) => ({
	id,
	timestamp: Number(timestamp) * 1000,
	name: utils.parseBytes32String(name.split('-')[1]),
	symbol: utils.parseBytes32String(symbol.split('-')[1]),
	duration: Number(duration) * 1000,
	purchaseToken: purchaseToken,
	purchaseExpiry: Number(purchaseExpiry) * 1000,
	purchaseTokenCap: wei(purchaseTokenCap.toString()),
	sponsor,
	purchaseDuration,
	sponsorFee: Number(sponsorFee) / 100,
	poolStatus,
});

export default useGetPoolsQuery;

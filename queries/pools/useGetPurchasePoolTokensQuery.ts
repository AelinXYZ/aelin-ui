//@ts-nocheck
import { wei } from '@synthetixio/wei';

import { GRAPH_ENDPOINT } from 'constants/endpoints';
import { useGetPurchasePoolTokens, PurchasePoolTokenResult } from '../../subgraph';

const useGetPurchasePoolTokensQuery = ({ purchaser }: { purchaser: string }) => {
	return useGetPurchasePoolTokens(
		GRAPH_ENDPOINT,
		{
			purchaser,
			orderBy: 'timestamp',
			orderDirection: 'desc',
		},
		{
			id: true,
			poolAddress: true,
			purchaseTokenAmount: true,
			purchaser: true,
			timestamp: true,
		}
	);
};

export const parsePurchasePoolToken = ({
	id,
	poolAddress,
	purchaseTokenAmount,
	timestamp,
	purchaser,
}: PurchasePoolTokenResult) => ({
	id,
	timestamp: Number(timestamp) * 1000,
	poolAddress,
	purchaseTokenAmount: wei(purchaseTokenAmount.toString()),
	purchaser,
});

export default useGetPurchasePoolTokensQuery;

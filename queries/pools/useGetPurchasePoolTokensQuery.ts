//@ts-nocheck
import { wei } from '@synthetixio/wei';

import { getGraphEndpoint } from 'constants/endpoints';
import { NetworkId } from 'constants/networks';
import { useGetPurchasePoolTokens, PurchasePoolTokenResult } from '../../subgraph';

const useGetPurchasePoolTokensQuery = ({
	purchaser,
	networkId,
}: {
	purchaser: string;
	networkId?: NetworkId;
}) => {
	return useGetPurchasePoolTokens(
		getGraphEndpoint(networkId),
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

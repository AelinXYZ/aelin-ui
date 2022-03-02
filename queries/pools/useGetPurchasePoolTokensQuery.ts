import { ethers } from 'ethers';
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
			// @ts-ignore
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
		},
		{},
		networkId
	);
};

export const parsePurchasePoolToken = ({
	id,
	poolAddress,
	purchaseTokenAmount,
	timestamp,
	purchaser,
}: PurchasePoolTokenResult) => ({
	id: ethers.utils.getAddress(id),
	timestamp: Number(timestamp) * 1000,
	poolAddress: ethers.utils.getAddress(poolAddress),
	purchaseTokenAmount: wei(purchaseTokenAmount.toString()),
	purchaser,
});

export default useGetPurchasePoolTokensQuery;

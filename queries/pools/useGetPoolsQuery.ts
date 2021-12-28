import { utils } from 'ethers';

import { getGraphEndpoint } from 'constants/endpoints';
import { useGetPoolCreateds, PoolCreatedResult } from '../../subgraph';
import { calculateStatus } from 'utils/time';
import { NetworkId } from 'constants/networks';

const useGetPoolsQuery = ({ networkId }: { networkId?: NetworkId }) => {
	return useGetPoolCreateds(
		getGraphEndpoint(networkId),
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
			purchaseTokenDecimals: true,
			timestamp: true,
			poolStatus: true,
			purchaseDuration: true,
			contributions: true,
			dealAddress: true,
			hasAllowList: true,
		},
		{},
		networkId ? networkId : NetworkId.Mainnet
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
	contributions,
	dealAddress,
	purchaseTokenDecimals,
	hasAllowList,
}: PoolCreatedResult) => {
	let formattedName = '';
	let formattedSymbol = '';
	try {
		formattedName = utils.parseBytes32String(name.split('-')[1]);
		formattedSymbol = utils.parseBytes32String(symbol.split('-')[1]);
	} catch (e) {
		formattedName = name.split('-')[1];
		formattedSymbol = symbol.split('-')[1];
	}
	return {
		id,
		timestamp: Number(timestamp) * 1000,
		name: formattedName,
		symbol: formattedSymbol,
		duration: Number(duration) * 1000,
		purchaseTokenDecimals: purchaseTokenDecimals ?? 0,
		purchaseToken,
		purchaseExpiry: Number(purchaseExpiry) * 1000,
		purchaseTokenCap,
		sponsor,
		contributions,
		purchaseDuration,
		sponsorFee,
		poolStatus: calculateStatus({ poolStatus, purchaseExpiry: Number(purchaseExpiry) * 1000 }),
		dealAddress,
		hasAllowList,
	};
};

export default useGetPoolsQuery;

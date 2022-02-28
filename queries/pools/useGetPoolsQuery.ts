import { utils } from 'ethers';
import { getGraphEndpoint } from 'constants/endpoints';
import { useGetPoolCreateds, PoolCreatedResult } from '../../subgraph';
import { calculateStatus } from 'utils/time';
import { nameToIdMapping, NetworkId } from 'constants/networks';

const useGetPoolsQuery = () => {
	return Object.entries(nameToIdMapping).map(([networkName, networkId]) => ({
		...useGetPoolCreateds(
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
				purchaseTokenSymbol: true,
				totalSupply: true,
			},
			{},
			networkId ? networkId : NetworkId.Mainnet
		),
		networkName,
	}));
};

export const parsePool = ({
	id,
	timestamp,
	name,
	symbol,
	duration,
	purchaseToken,
	purchaseTokenSymbol,
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
	network,
	totalSupply,
}: PoolCreatedResult & { network: string }) => {
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
		purchaseTokenSymbol,
		purchaseExpiry: Number(purchaseExpiry) * 1000,
		poolExpiry: 1000 * (Number(duration) + Number(purchaseExpiry)),
		purchaseTokenCap,
		sponsor,
		contributions,
		purchaseDuration,
		sponsorFee,
		poolStatus: calculateStatus({ poolStatus, purchaseExpiry: Number(purchaseExpiry) * 1000 }),
		dealAddress,
		hasAllowList,
		network,
		totalSupply,
	};
};

export default useGetPoolsQuery;

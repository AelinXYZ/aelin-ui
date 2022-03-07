import { ethers } from 'ethers';

import { calculateStatus } from 'utils/time';

import { Env } from 'constants/env';
import { getGraphEndpoint } from 'constants/endpoints';
import {
	nameToIdMapping,
	productionNetworks,
	developmentNetworks,
	NetworkId,
} from 'constants/networks';

import { useGetPoolCreateds, PoolCreatedResult } from '../../subgraph';

const useGetPoolsQuery = () => {
	const isDev = process.env.NODE_ENV !== Env.PROD;

	const networks = isDev ? developmentNetworks : productionNetworks;

	return networks.map((networkName) => ({
		...useGetPoolCreateds(
			getGraphEndpoint(nameToIdMapping[networkName]),
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
			nameToIdMapping[networkName] ? nameToIdMapping[networkName] : NetworkId.Mainnet
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
}: PoolCreatedResult & { network?: string }) => {
	let formattedName = '';
	let formattedSymbol = '';
	try {
		formattedName = ethers.utils.parseBytes32String(name.split('-')[1]);
		formattedSymbol = ethers.utils.parseBytes32String(symbol.split('-')[1]);
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
		purchaseToken: ethers.utils.getAddress(purchaseToken),
		purchaseTokenSymbol,
		purchaseExpiry: Number(purchaseExpiry) * 1000,
		poolExpiry: 1000 * (Number(duration) + Number(purchaseExpiry)),
		purchaseTokenCap,
		sponsor: ethers.utils.getAddress(sponsor),
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

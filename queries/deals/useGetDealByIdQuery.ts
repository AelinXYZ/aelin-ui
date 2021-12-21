import { ethers } from 'ethers';
import { getGraphEndpoint } from 'constants/endpoints';
import { DealCreatedResult, useGetDealCreatedById } from '../../subgraph';
import { NetworkId } from 'constants/networks';

const useGetDealByIdQuery = ({ id, networkId }: { id: string; networkId?: NetworkId }) =>
	useGetDealCreatedById(
		getGraphEndpoint(networkId),
		{
			id,
		},
		{
			id: true,
			name: true,
			symbol: true,
			sponsor: true,
			poolAddress: true,
		}
	);

export const parseDeal = (deal: DealCreatedResult) => ({
	...deal,
	name: ethers.utils.parseBytes32String(deal.name.split('-')[1]),
	symbol: ethers.utils.parseBytes32String(deal.symbol.split('-')[1]),
});

export default useGetDealByIdQuery;

import { ethers } from 'ethers';
import { GRAPH_ENDPOINT } from 'constants/endpoints';
import { DealCreatedResult, useGetDealCreatedById } from '../../subgraph';

const useGetDealByIdQuery = ({ id }: { id: string }) =>
	useGetDealCreatedById(
		GRAPH_ENDPOINT,
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

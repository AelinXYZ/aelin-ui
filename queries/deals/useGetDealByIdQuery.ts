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
			purchaseTokenCap: true,
			purchaseToken: true,
			duration: true,
			sponsorFee: true,
			sponsor: true,
			purchaseExpiry: true,
			timestamp: true,
			DealStatus: true,
			purchaseDuration: true,
			contributions: true,
		}
	);

export const parseDeal = (deal: DealCreatedResult) => deal;

export default useGetDealByIdQuery;

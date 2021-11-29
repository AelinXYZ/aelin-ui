import { GRAPH_ENDPOINT } from 'constants/endpoints';
import { useGetPoolCreatedById } from '../../subgraph';

const useGetPoolByIdQuery = ({ id }: { id: string }) =>
	useGetPoolCreatedById(
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
			poolStatus: true,
			purchaseDuration: true,
			contributions: true,
			dealAddress: true,
		}
	);

export default useGetPoolByIdQuery;

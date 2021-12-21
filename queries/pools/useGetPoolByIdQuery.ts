import { getGraphEndpoint } from 'constants/endpoints';
import { NetworkId } from 'constants/networks';
import { useGetPoolCreatedById } from '../../subgraph';

const useGetPoolByIdQuery = ({ id, networkId }: { id: string; networkId?: NetworkId }) =>
	useGetPoolCreatedById(
		getGraphEndpoint(networkId),
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
			purchaseTokenDecimals: true,
			timestamp: true,
			poolStatus: true,
			purchaseDuration: true,
			contributions: true,
			dealAddress: true,
		},
		{},
		networkId ? networkId : NetworkId.Mainnet
	);

export default useGetPoolByIdQuery;

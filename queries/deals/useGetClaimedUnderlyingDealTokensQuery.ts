import { wei } from '@synthetixio/wei';
import { GRAPH_ENDPOINT } from 'constants/endpoints';
import {
	ClaimedUnderlyingDealTokenResult,
	useGetClaimedUnderlyingDealTokens,
} from '../../subgraph';

const useGetClaimedUnderlyingDealTokensQuery = ({
	dealAddress,
	recipient,
}: {
	dealAddress: string;
	recipient: string;
}) =>
	useGetClaimedUnderlyingDealTokens(
		GRAPH_ENDPOINT,
		{
			where: { dealAddress, recipient },
		},
		{
			id: true,
			recipient: true,
			underlyingDealTokensClaimed: true,
			underlyingDealTokenAddress: true,
			dealAddress: true,
		}
	);

export const parseClaimedResult = (claimedResult: ClaimedUnderlyingDealTokenResult) => ({
	...claimedResult,
	underlyingDealTokensClaimed: wei(claimedResult.underlyingDealTokensClaimed.toString()),
});

export default useGetClaimedUnderlyingDealTokensQuery;

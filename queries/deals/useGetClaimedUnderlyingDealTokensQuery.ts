import { wei } from '@synthetixio/wei';
import { GRAPH_ENDPOINT } from 'constants/endpoints';
import {
	ClaimedUnderlyingDealTokensResult,
	useGetClaimedUnderlyingDealTokenss,
} from '../../subgraph';

const useGetClaimedUnderlyingDealTokensQuery = ({
	dealAddress,
	recipient,
}: {
	dealAddress: string;
	recipient: string;
}) =>
	useGetClaimedUnderlyingDealTokenss(
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

export const parseClaimedResult = (claimedResult: ClaimedUnderlyingDealTokensResult) => ({
	...claimedResult,
	underlyingDealTokensClaimed: wei(claimedResult.underlyingDealTokensClaimed.toString()),
});

export default useGetClaimedUnderlyingDealTokensQuery;

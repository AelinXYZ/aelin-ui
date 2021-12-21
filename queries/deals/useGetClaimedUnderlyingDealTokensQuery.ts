import { wei } from '@synthetixio/wei';
import { getGraphEndpoint } from 'constants/endpoints';
import { NetworkId } from 'constants/networks';
import {
	ClaimedUnderlyingDealTokenResult,
	useGetClaimedUnderlyingDealTokens,
} from '../../subgraph';

const useGetClaimedUnderlyingDealTokensQuery = ({
	dealAddress,
	recipient,
	networkId,
}: {
	dealAddress: string;
	recipient: string;
	networkId?: NetworkId;
}) =>
	useGetClaimedUnderlyingDealTokens(
		getGraphEndpoint(networkId),
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

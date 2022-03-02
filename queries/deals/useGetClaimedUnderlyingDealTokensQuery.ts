import { ethers } from 'ethers';
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
		},
		{},
		networkId ? networkId : NetworkId.Mainnet
	);

export const parseClaimedResult = (claimedResult: ClaimedUnderlyingDealTokenResult) => ({
	...claimedResult,
	id: claimedResult.id,
	dealAddress: ethers.utils.getAddress(claimedResult.dealAddress),
	recipient: ethers.utils.getAddress(claimedResult.recipient),
	underlyingDealTokenAddress: ethers.utils.getAddress(claimedResult.underlyingDealTokenAddress),
	underlyingDealTokensClaimed: wei(claimedResult.underlyingDealTokensClaimed.toString()),
});

export default useGetClaimedUnderlyingDealTokensQuery;

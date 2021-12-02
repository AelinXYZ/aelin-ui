import { GRAPH_ENDPOINT } from 'constants/endpoints';
import { DealDetailsResult, useGetDealDetailsById } from '../../subgraph';

const useGetDealDetailsByIdQuery = ({ id }: { id: string }) =>
	useGetDealDetailsById(
		GRAPH_ENDPOINT,
		{
			id,
		},
		{
			id: true,
			underlyingDealToken: true,
			purchaseTokenTotalForDeal: true,
			underlyingDealTokenTotal: true,
			vestingCliff: true,
			vestingPeriod: true,
			proRataRedemptionPeriod: true,
			openRedemptionPeriod: true,
			holder: true,
			holderFundingDuration: true,
			holderFundingExpiration: true,
		}
	);

export const parseDealDetails = (dealDetails: DealDetailsResult) => ({
	...dealDetails,
	holderFundingExpiration: Number(dealDetails.holderFundingExpiration) * 1000,
});

export default useGetDealDetailsByIdQuery;

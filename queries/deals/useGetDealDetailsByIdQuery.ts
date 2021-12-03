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
			proRataRedemptionPeriodStart: true,
			openRedemptionPeriod: true,
			holder: true,
			holderFundingDuration: true,
			holderFundingExpiration: true,
			isDealFunded: true,
		}
	);

export const parseDealDetails = (dealDetails: DealDetailsResult) => ({
	...dealDetails,
	holderFundingExpiration: Number(dealDetails.holderFundingExpiration) * 1000,
	proRataRedemptionPeriod: Number(dealDetails.proRataRedemptionPeriod) * 1000,
	openRedemptionPeriod: Number(dealDetails.openRedemptionPeriod) * 1000,
	proRataRedemptionPeriodStart:
		dealDetails?.proRataRedemptionPeriodStart != null
			? Number(dealDetails.proRataRedemptionPeriodStart) * 1000
			: null,
});

export default useGetDealDetailsByIdQuery;

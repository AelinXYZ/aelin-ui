import { GRAPH_ENDPOINT } from 'constants/endpoints';
import { DealDetailResult, useGetDealDetailById } from '../../subgraph';

const useGetDealDetailByIdQuery = ({ id }: { id: string }) =>
	useGetDealDetailById(
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

export const parseDealDetail = (dealDetail: DealDetailResult) => ({
	...dealDetail,
	holderFundingExpiration: Number(dealDetail.holderFundingExpiration) * 1000,
	proRataRedemptionPeriod: Number(dealDetail.proRataRedemptionPeriod) * 1000,
	openRedemptionPeriod: Number(dealDetail.openRedemptionPeriod) * 1000,
	vestingPeriod: Number(dealDetail.vestingPeriod) * 1000,
	vestingCliff: Number(dealDetail.vestingCliff) * 1000,
	proRataRedemptionPeriodStart:
		dealDetail?.proRataRedemptionPeriodStart != null
			? Number(dealDetail.proRataRedemptionPeriodStart) * 1000
			: null,
});

export default useGetDealDetailByIdQuery;

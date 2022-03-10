import { ethers } from 'ethers';
import { getGraphEndpoint } from 'constants/endpoints';
import { NetworkId } from 'constants/networks';
import { DealDetailResult, useGetDealDetailById } from '../../subgraph';

const useGetDealDetailByIdQuery = ({ id, networkId }: { id: string; networkId?: NetworkId }) =>
	useGetDealDetailById(
		getGraphEndpoint(networkId),
		{
			id,
		},
		{
			id: true,
			underlyingDealToken: true,
			purchaseTokenTotalForDeal: true,
			underlyingDealTokenTotal: true,
			underlyingDealTokenTotalSupply: true,
			vestingCliff: true,
			vestingPeriod: true,
			proRataRedemptionPeriod: true,
			proRataRedemptionPeriodStart: true,
			openRedemptionPeriod: true,
			holder: true,
			holderFundingDuration: true,
			holderFundingExpiration: true,
			isDealFunded: true,
		},
		{},
		networkId ? networkId : NetworkId.Mainnet
	);

export const parseDealDetail = (dealDetail: DealDetailResult) => ({
	...dealDetail,
	id: dealDetail.id,
	underlyingDealToken: ethers.utils.getAddress(dealDetail.underlyingDealToken),
	holder: ethers.utils.getAddress(dealDetail.holder),
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

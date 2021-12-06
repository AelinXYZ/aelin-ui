import { FC, useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';

import { PageLayout } from 'sections/Layout';
import useGetDealDetailsByIdQuery, {
	parseDealDetails,
} from 'queries/deals/useGetDealDetailsByIdQuery';
import useGetDealByIdQuery, { parseDeal } from 'queries/deals/useGetDealByIdQuery';
import useGetClaimedUnderlyingDealTokensQuery, {
	parseClaimedResult,
} from 'queries/deals/useGetClaimedUnderlyingDealTokensQuery';

import SectionTitle from 'sections/shared/SectionTitle';
import CreateDeal from 'sections/AelinDeal/CreateDeal';
import PurchasePool from './PurchasePool';
import { PoolCreatedResult } from 'subgraph';
import { Status } from 'components/DealStatus';
import Connector from 'containers/Connector';
import AcceptOrRejectDeal from 'sections/AelinDeal/AcceptOrRejectDeal';
import VestingDeal from 'sections/AelinDeal/VestingDeal';
import FundDeal from '../AelinDeal/FundDeal';

interface ViewPoolProps {
	pool: PoolCreatedResult | null;
	poolAddress: string;
}

const ViewPool: FC<ViewPoolProps> = ({ pool, poolAddress }) => {
	const { walletAddress, provider } = Connector.useContainer();
	const [dealBalance, setDealBalance] = useState<number | null>(null);
	const dealDetailsQuery = useGetDealDetailsByIdQuery({ id: pool?.dealAddress ?? '' });
	const dealQuery = useGetDealByIdQuery({ id: pool?.dealAddress ?? '' });

	const deal = useMemo(() => {
		const dealDetails =
			dealDetailsQuery?.data != null ? parseDealDetails(dealDetailsQuery?.data) : {};
		const dealInfo = dealQuery?.data != null ? parseDeal(dealQuery?.data) : {};
		return { ...dealInfo, ...dealDetails };
	}, [dealQuery?.data, dealDetailsQuery?.data]);

	const claimedQuery = useGetClaimedUnderlyingDealTokensQuery({
		dealAddress: deal?.id ?? '',
		recipient: walletAddress ?? '',
	});

	const claims = useMemo(
		() => (claimedQuery?.data ?? []).map(parseClaimedResult),
		[claimedQuery?.data]
	);

	useEffect(() => {
		async function getDealBalance() {
			if (deal?.id != null && provider != null && walletAddress != null) {
				const contract = new ethers.Contract(deal?.id, dealAbi, provider);
				const balance = await contract.balanceOf(walletAddress);
				const decimals = await contract.decimals();
				const formattedDealBalance = Number(ethers.utils.formatUnits(balance, decimals));
				setDealBalance(formattedDealBalance);
			}
		}
		getDealBalance();
	}, [deal?.id, provider, walletAddress]);

	const now = useMemo(() => Date.now(), []);

	return (
		<PageLayout title={<SectionTitle address={poolAddress} title="Aelin Pool" />} subtitle="">
			<PurchasePool pool={pool} />
			{(pool?.poolStatus === Status.FundingDeal && (deal?.holderFundingExpiration ?? 0) <= now) ||
			(pool?.poolStatus === Status.SeekingDeal && walletAddress === pool?.sponsor) ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={null} title="Create Deal" />
						</ContentTitle>
					</ContentHeader>
					<CreateDeal poolAddress={poolAddress} />
				</SectionWrapper>
			) : null}
			{pool?.poolStatus === Status.FundingDeal && deal?.id != null ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={deal.id} title="Awaiting Holder Funding of Proposed Deal" />
						</ContentTitle>
					</ContentHeader>
					<FundDeal
						holder={deal?.holder}
						dealAddress={deal?.id}
						purchaseTokenTotalForDeal={deal?.purchaseTokenTotalForDeal}
						purchaseToken={pool.purchaseToken}
						token={deal?.underlyingDealToken}
						amount={deal?.underlyingDealTokenTotal}
						holderFundingExpiration={deal?.holderFundingExpiration}
					/>
				</SectionWrapper>
			) : null}
			{pool?.poolStatus === Status.DealOpen && deal?.id != null ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={deal?.id} title="Aelin Deal" />
						</ContentTitle>
					</ContentHeader>
					<AcceptOrRejectDeal pool={pool} deal={deal} />
				</SectionWrapper>
			) : null}
			{deal?.id != null &&
			((dealBalance != null && dealBalance > 0) || (claims ?? []).length > 0) ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle addToMetamask={true} address={deal.id} title="Deal Vesting" />
						</ContentTitle>
					</ContentHeader>
					<VestingDeal deal={deal} dealBalance={dealBalance} claims={claims} />
				</SectionWrapper>
			) : null}
		</PageLayout>
	);
};

const SectionWrapper = styled.div`
	margin-top: 35px;
`;

export default ViewPool;

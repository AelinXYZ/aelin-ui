import { FC, useMemo } from 'react';
import styled from 'styled-components';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { PageLayout } from 'sections/Layout';
import useGetDealDetailsByIdQuery, {
	parseDealDetails,
} from 'queries/deals/useGetDealDetailsByIdQuery';
import useGetDealByIdQuery, { parseDeal } from 'queries/deals/useGetDealByIdQuery';

import SectionTitle from 'sections/shared/SectionTitle';
import CreateDeal from 'sections/AelinDeal/CreateDeal';
import PurchasePool from './PurchasePool';
import { PoolCreatedResult } from 'subgraph';
import { Status } from 'components/DealStatus';
import Connector from 'containers/Connector';
import AcceptOrRejectDeal from 'sections/AelinDeal/AcceptOrRejectDeal';
import VestingDeal from 'sections/AelinDeal/VestingDeal';
import { ethers } from 'ethers';

interface ViewPoolProps {
	pool: PoolCreatedResult | null;
	poolAddress: string;
}

const ViewPool: FC<ViewPoolProps> = ({ pool, poolAddress }) => {
	const { walletAddress } = Connector.useContainer();
	const dealDetailsQuery = useGetDealDetailsByIdQuery({ id: pool?.dealAddress ?? '' });
	const dealQuery = useGetDealByIdQuery({ id: pool?.dealAddress ?? '' });

	const deal = useMemo(() => {
		const dealDetails =
			dealDetailsQuery?.data != null ? parseDealDetails(dealDetailsQuery?.data) : {};
		const dealInfo = dealQuery?.data != null ? parseDeal(dealQuery?.data) : {};
		return { ...dealInfo, ...dealDetails };
	}, [dealQuery?.data, dealDetailsQuery?.data]);

	const fakeDeal = useMemo(
		() => ({
			id: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F6',
			name: 'fake deal',
			symbol: 'fkd',
			poolAddress: '0x443Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
			underlyingDealToken: '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
			underlyingDealTokenTotal: ethers.utils.parseEther('1'),
			purchaseTokenTotalForDeal: ethers.utils.parseEther('0.5'),
			vestingPeriod: 0,
			vestingCliff: 0,
			proRataRedemptionPeriod: 30 * 60 + 1,
			openRedemptionPeriod: 30 * 60 + 1,
		}),
		[]
	);

	return (
		<PageLayout title={<SectionTitle address={poolAddress} title="Aelin Pool" />} subtitle="">
			<PurchasePool pool={pool} />
			{pool?.poolStatus === Status.SeekingDeal && walletAddress === pool?.sponsor ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={null} title="Create Deal" />
						</ContentTitle>
					</ContentHeader>
					<CreateDeal poolAddress={poolAddress} />
				</SectionWrapper>
			) : null}
			{pool?.poolStatus === Status.FundingDeal &&
			deal?.id != null &&
			walletAddress === deal?.holder ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={deal.id} title="Fund Aelin Deal" />
						</ContentTitle>
					</ContentHeader>
					<div>TODO funding section for the holder</div>
				</SectionWrapper>
			) : null}
			{/* pool?.poolStatus === Status.DealOpen && deal?.id != null ? ( */}
			<SectionWrapper>
				<ContentHeader>
					<ContentTitle>
						<SectionTitle address={fakeDeal.id} title="Aelin Deal" />
					</ContentTitle>
				</ContentHeader>
				<AcceptOrRejectDeal pool={pool} deal={fakeDeal} />
			</SectionWrapper>
			{/*) : null} */}
			{deal?.id != null ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle addToMetamask={true} address={deal.id} title="Deal Vesting" />
						</ContentTitle>
					</ContentHeader>
					<VestingDeal deal={deal} />
				</SectionWrapper>
			) : null}
		</PageLayout>
	);
};

const SectionWrapper = styled.div`
	margin-top: 35px;
`;

export default ViewPool;

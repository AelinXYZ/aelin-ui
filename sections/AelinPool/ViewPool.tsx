import { FC } from 'react';
import styled from 'styled-components';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { PageLayout } from 'sections/Layout';
import { GridItem } from 'components/Grid/Grid';
import { FlexDiv } from 'components/common';
import Grid from 'components/Grid';
import ActionBox, { ActionBoxType } from 'components/ActionBox';

import SectionTitle from 'sections/shared/SectionTitle';
import CreateDeal from 'sections/AelinDeal/CreateDeal';
import PurchasePool from './PurchasePool';
import { PoolCreatedResult } from 'subgraph';
import { Status } from 'components/DealStatus';
import Connector from 'containers/Connector';
import AcceptOrRejectDeal from 'sections/AelinDeal/AcceptOrRejectDeal';

interface ViewPoolProps {
	pool: PoolCreatedResult | null;
	dealVestingGridItems: GridItem[] | null;
	poolAddress: string;
}

const ViewPool: FC<ViewPoolProps> = ({ pool, poolAddress, dealVestingGridItems }) => {
	const { walletAddress } = Connector.useContainer();
	// TODO get rid of this when added dealAddress to the pool entity on the graph
	const dealAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
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
			{/* TODO manage these sections below with the user flow */}
			{pool?.poolStatus === Status.DealOpen ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							{/* TODO add the deal address to the pool entity when a deal is created and use it here and pass it below */}
							<SectionTitle address={dealAddress} title="Aelin Deal" />
						</ContentTitle>
					</ContentHeader>
					<AcceptOrRejectDeal dealAddress={dealAddress} />
				</SectionWrapper>
			) : null}
			{dealAddress != null && dealVestingGridItems != null ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle addToMetamask={true} address={dealAddress} title="Deal Vesting" />
						</ContentTitle>
					</ContentHeader>
					<FlexDiv>
						<Grid hasInputFields={false} gridItems={dealVestingGridItems} />
						<ActionBox
							actionBoxType={ActionBoxType.VestingDeal}
							onSubmit={(value) => {
								console.log('vest:', value);
							}}
							input={{ placeholder: '0', label: 'Vested: 2000 USDC', maxValue: 2000 }}
						/>
					</FlexDiv>
				</SectionWrapper>
			) : null}
		</PageLayout>
	);
};

const SectionWrapper = styled.div`
	margin-top: 35px;
`;

export default ViewPool;

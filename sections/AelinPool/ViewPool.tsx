import { FC } from 'react';
import styled from 'styled-components';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { PageLayout } from 'sections/Layout';
import { GridItem } from 'components/Grid/Grid';
import { FlexDiv } from 'components/common';
import Grid from 'components/Grid';
import ActionBox, { ActionBoxType, TransactionType } from 'components/ActionBox';

import SectionTitle from 'sections/shared/SectionTitle';
import SectionDetails from 'sections/shared/SectionDetails';
import CreateDeal from 'sections/AelinDeal/CreateDeal';
import PurchasePool from './PurchasePool';
import { PoolCreatedResult } from 'subgraph';

interface ViewPoolProps {
	pool: PoolCreatedResult | null;
	dealGridItems: GridItem[] | null;
	dealVestingGridItems: GridItem[] | null;
	poolAddress: string;
	dealAddress: string | null;
}

const ViewPool: FC<ViewPoolProps> = ({
	pool,
	poolAddress,
	dealAddress,
	dealGridItems,
	dealVestingGridItems,
}) => (
	<PageLayout title={<SectionTitle address={poolAddress} title="Aelin Pool" />} subtitle="">
		<PurchasePool pool={pool} />
		<SectionWrapper>
			<ContentHeader>
				<ContentTitle>
					<SectionTitle address={null} title="Create Deal" />
				</ContentTitle>
			</ContentHeader>
			<CreateDeal poolAddress={poolAddress} />
		</SectionWrapper>
		{dealAddress != null && dealGridItems != null ? (
			<SectionWrapper>
				<ContentHeader>
					<ContentTitle>
						<SectionTitle address={dealAddress} title="Aelin Deal" />
					</ContentTitle>
				</ContentHeader>
				<SectionDetails
					actionBoxType={ActionBoxType.PendingDeal}
					gridItems={dealGridItems}
					onSubmit={(value, txnType) => {
						if (txnType === TransactionType.Withdraw) {
							console.log('withdral', value);
						} else {
							console.log('click me to accept or reject: ', `tokens: ${value}`);
						}
					}}
				/>
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

const SectionWrapper = styled.div`
	margin-top: 35px;
`;

export default ViewPool;

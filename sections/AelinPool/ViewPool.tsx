import { FC } from 'react';
import styled from 'styled-components';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { PageLayout } from 'sections/Layout';
import { GridItem } from 'components/Grid/Grid';
import { FlexDiv } from 'components/common';
import Grid from 'components/Grid';

import SectionTitle from 'sections/shared/SectionTitle';
import SectionDetails from 'sections/shared/SectionDetails';
import CreateDeal from 'sections/AelinDeal/CreateDeal';

interface ViewPoolProps {
	poolGridItems: GridItem[];
	dealGridItems: GridItem[] | null;
	dealVestingGridItems: GridItem[] | null;
	poolAddress: string;
	dealAddress: string | null;
}

const ViewPool: FC<ViewPoolProps> = ({
	poolGridItems,
	poolAddress,
	dealAddress,
	dealGridItems,
	dealVestingGridItems,
}) => (
	<PageLayout title={<SectionTitle address={poolAddress} title="Aelin Pool" />} subtitle="">
		<SectionDetails isPool={true} gridItems={poolGridItems} />
		<SectionWrapper>
			<ContentHeader>
				<ContentTitle>
					<SectionTitle address={null} title="Create Deal" />
				</ContentTitle>
			</ContentHeader>
			<CreateDeal />
		</SectionWrapper>
		{dealAddress != null && dealGridItems != null ? (
			<SectionWrapper>
				<ContentHeader>
					<ContentTitle>
						<SectionTitle address={dealAddress} title="Aelin Deal" />
					</ContentTitle>
				</ContentHeader>
				<SectionDetails isPool={false} gridItems={dealGridItems} />
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
				</FlexDiv>
			</SectionWrapper>
		) : null}
	</PageLayout>
);

const SectionWrapper = styled.div`
	margin-top: 35px;
`;

export default ViewPool;

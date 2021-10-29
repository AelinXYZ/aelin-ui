import { FC } from 'react';
import styled from 'styled-components';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { PageLayout } from 'sections/Layout';
import { GridItem } from 'components/Grid/Grid';

import SectionTitle from 'sections/shared/SectionTitle';
import SectionDetails from 'sections/shared/SectionDetails';
import { FormikHandlers } from 'formik';
import { SummaryItem } from 'components/SummaryBox/SummaryBox';

interface ViewPoolProps {
	poolGridItems: GridItem[];
	dealGridItems: GridItem[] | null;
	poolAddress: string;
	dealAddress: string | null;
	createDeal: {
		formik: FormikHandlers;
		gridItems: GridItem[];
		summaryItems: SummaryItem[];
	} | null;
}

const ViewPool: FC<ViewPoolProps> = ({
	poolGridItems,
	poolAddress,
	dealAddress,
	dealGridItems,
	createDeal,
}) => (
	<PageLayout title={<SectionTitle address={poolAddress} title="Aelin Pool" />} subtitle="">
		<SectionDetails isPool={true} gridItems={poolGridItems} />
		{createDeal != null ? (
			<>
				<CreateDeal />
			</>
		) : null}
		{dealAddress != null && dealGridItems != null ? (
			<DealWrapper>
				<ContentHeader>
					<ContentTitle>
						<SectionTitle address={dealAddress} title="Aelin Deal" />
					</ContentTitle>
				</ContentHeader>
				<SectionDetails isPool={false} gridItems={dealGridItems} />
			</DealWrapper>
		) : null}
	</PageLayout>
);

const DealWrapper = styled.div`
	margin-top: 35px;
`;

export default ViewPool;

import { FC } from 'react';
import styled from 'styled-components';
import { ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { PageLayout } from 'sections/Layout';
import { GridItem } from 'components/Grid/Grid';
import CreateForm from 'sections/shared/CreateForm';
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
		isReady: boolean;
		formik: FormikHandlers;
		gridItems: GridItem[];
		summaryItems: SummaryItem[];
	};
}

const ViewPool: FC<ViewPoolProps> = ({
	poolGridItems,
	poolAddress,
	dealAddress,
	dealGridItems,
	createDeal,
}) => (
	<PageLayout title={<SectionTitle address={poolAddress} title="Aelin Pool" />} subtitle="">
		<SectionDetails gridItems={poolGridItems} />
		{createDeal.isReady ? (
			<>
				<CreateForm
					formik={createDeal.formik}
					gridItems={createDeal.gridItems}
					summaryItems={createDeal.summaryItems}
					type="Pool"
				/>
				{/* address _underlyingDealToken,
        uint256 _purchaseTokenTotalForDeal,
        uint256 _underlyingDealTokenTotal,
        uint256 _vestingPeriod,
        uint256 _vestingCliff,
        uint256 _proRataRedemptionPeriod,
        uint256 _openRedemptionPeriod,
        address _holder,
        uint256 _holderFundingExpiry
				<Grid hasInputFields={true} gridItems={gridItems} /> */}
			</>
		) : null}
		{dealAddress != null && dealGridItems != null ? (
			<DealWrapper>
				<ContentHeader>
					<ContentTitle>
						<SectionTitle address={dealAddress} title="Aelin Deal" />
					</ContentTitle>
				</ContentHeader>
				<SectionDetails gridItems={dealGridItems} />
			</DealWrapper>
		) : null}
	</PageLayout>
);

const DealWrapper = styled.div`
	margin-top: 35px;
`;

export default ViewPool;

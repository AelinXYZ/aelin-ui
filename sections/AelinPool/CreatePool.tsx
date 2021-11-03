import { FC } from 'react';
import { FormikHandlers } from 'formik';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import { GridItem } from 'components/Grid/Grid';
import SummaryBox from 'components/SummaryBox';
import { SummaryItem } from 'components/SummaryBox/SummaryBox';
import { FlexDiv } from 'components/common';

export interface CreatePoolProps {
	formik: FormikHandlers;
	gridItems: GridItem[];
	summaryItems: SummaryItem[];
}

const CreatePool: FC<CreatePoolProps> = ({ formik, gridItems, summaryItems }) => {
	return (
		<PageLayout title={<>Create Pool</>} subtitle="">
			<form onSubmit={formik.handleSubmit}>
				<FlexDiv>
					<Grid hasInputFields={true} gridItems={gridItems} />
					<SummaryBox summaryText="Create Pool" header="Pool summary" summaryItems={summaryItems} />
				</FlexDiv>
			</form>
		</PageLayout>
	);
};

export default CreatePool;

import { FC } from 'react';
import { FormikHandlers } from 'formik';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import { GridItem } from 'components/Grid/Grid';
import SummaryBox from 'components/SummaryBox';
import { SummaryItem } from 'components/SummaryBox/SummaryBox';
import { FlexDiv } from 'components/common';

export interface CreateFormProps {
	formik: FormikHandlers;
	gridItems: GridItem[];
	summaryItems: SummaryItem[];
	type: 'Pool' | 'Deal';
}

const CreateForm: FC<CreateFormProps> = ({ formik, gridItems, summaryItems, type }) => {
	return (
		<form onSubmit={formik.handleSubmit}>
			<FlexDiv>
				<Grid hasInputFields={true} gridItems={gridItems} />
				<SummaryBox
					summaryText={`Create ${type}`}
					header={`${type} summary`}
					summaryItems={summaryItems}
				/>
			</FlexDiv>
		</form>
	);
};

export default CreateForm;

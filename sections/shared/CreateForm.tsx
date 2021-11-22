import { FC, useMemo } from 'react';
import { FormikProps } from 'formik';

import Grid from 'components/Grid';
import { GridItem } from 'components/Grid/Grid';
import SummaryBox from 'components/SummaryBox';
import { SummaryItem, CreateTxType } from 'components/SummaryBox/SummaryBox';
import { FlexDiv } from 'components/common';
import { Transaction } from 'constants/transactions';

export interface CreateFormProps {
	formik: FormikProps<any>;
	gridItems: GridItem[];
	summaryItems: SummaryItem[];
	txType: CreateTxType;
	txState: Transaction;
	txHash: string | null;
}

const CreateForm: FC<CreateFormProps> = ({
	txState,
	txHash,
	formik,
	gridItems,
	summaryItems,
	txType,
}) => {
	const isValidForm = useMemo(
		() => Object.keys(formik?.errors ?? {}).length === 0,
		[formik.errors]
	);
	return (
		<FlexDiv>
			<Grid hasInputFields={true} gridItems={gridItems} />
			<SummaryBox
				formik={formik}
				isValidForm={isValidForm}
				txType={txType}
				summaryItems={summaryItems}
				txState={txState}
				txHash={txHash}
			/>
		</FlexDiv>
	);
};

export default CreateForm;

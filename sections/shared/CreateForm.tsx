import { FC, useMemo } from 'react';
import { FormikProps } from 'formik';

import Grid from 'components/Grid';
import { GridItem } from 'components/Grid/Grid';
import SummaryBox from 'components/SummaryBox';
import { SummaryItem, CreateTxType } from 'components/SummaryBox/SummaryBox';
import { FlexDiv } from 'components/common';
import { TransactionStatus } from 'constants/transactions';
import { GasLimitEstimate } from 'constants/networks';
import { wei } from '@synthetixio/wei';

export interface CreateFormProps {
	formik: FormikProps<any>;
	gridItems: GridItem[];
	summaryItems: SummaryItem[];
	txType: CreateTxType;
	txState: TransactionStatus;
	txHash: string | null;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	handleCancelPool: () => void;
	cancelGasLimitEstimate: GasLimitEstimate;
}

const CreateForm: FC<CreateFormProps> = ({
	txState,
	formik,
	gridItems,
	summaryItems,
	txType,
	setGasPrice,
	gasLimitEstimate,
	handleCancelPool,
	cancelGasLimitEstimate,
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
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				handleCancelPool={handleCancelPool}
				cancelGasLimitEstimate={cancelGasLimitEstimate}
			/>
		</FlexDiv>
	);
};

export default CreateForm;

//@ts-nocheck
import { FC } from 'react';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import ActionBox, { ActionBoxType } from 'components/ActionBox';
import { GridItem } from 'components/Grid/Grid';
import { InputType } from 'components/ActionBox/ActionBox';
import { TransactionStatus, TransactionType } from 'constants/transactions';
import { GasLimitEstimate } from 'constants/networks';
import { Status } from 'components/DealStatus';

interface SectionDetailsProps {
	gridItems: GridItem[];
	actionBoxType: ActionBoxType;
	onSubmit: (value: number | string, txnType: TransactionType, isMax?: boolean) => void;
	input: InputType;
	allowance: string;
	onApprove: () => void;
	txState: TransactionStatus;
	setTxState: (tx: TransactionStatus) => void;
	isPurchaseExpired?: boolean;
	dealRedemptionData?: { status: Status; maxProRata: string; isOpenEligible: boolean };
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	privatePoolDetails?: { isPrivatePool: boolean; privatePoolAmount: string };
	setTxType: (txnType: TransactionType) => void;
	txType: TransactionType;
	setIsMaxValue: (isMax: boolean) => void;
	inputValue: number;
	setInputValue: (num: number) => void;
}

const SectionDetails: FC<SectionDetailsProps> = ({
	gridItems,
	actionBoxType,
	onSubmit,
	onApprove,
	allowance,
	input = { placeholder: '0', label: '', maxValue: 0, symbol: '' },
	txState,
	setTxState,
	isPurchaseExpired,
	setGasPrice,
	gasLimitEstimate,
	privatePoolDetails,
	dealRedemptionData,
	txType,
	setTxType,
	setIsMaxValue,
	inputValue,
	setInputValue,
}) => (
	<FlexDiv>
		<Grid hasInputFields={false} gridItems={gridItems} />
		<ActionBox
			actionBoxType={actionBoxType}
			onApprove={onApprove}
			allowance={allowance}
			onSubmit={onSubmit}
			dealRedemptionData={dealRedemptionData}
			input={input}
			txState={txState}
			setTxState={setTxState}
			isPurchaseExpired={isPurchaseExpired}
			setGasPrice={setGasPrice}
			gasLimitEstimate={gasLimitEstimate}
			privatePoolDetails={privatePoolDetails}
			txType={txType}
			setTxType={setTxType}
			setIsMaxValue={setIsMaxValue}
			inputValue={inputValue}
			setInputValue={setInputValue}
		/>
	</FlexDiv>
);

export default SectionDetails;

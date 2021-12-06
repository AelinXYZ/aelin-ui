import { FC, MouseEventHandler } from 'react';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import ActionBox, { ActionBoxType, TransactionType } from 'components/ActionBox';
import { GridItem } from 'components/Grid/Grid';
import { InputType } from 'components/ActionBox/ActionBox';
import { Transaction } from 'constants/transactions';
import { GasLimitEstimate } from 'constants/networks';

interface SectionDetailsProps {
	gridItems: GridItem[];
	actionBoxType: ActionBoxType;
	onSubmit: (value: number | string, txnType: TransactionType, isMax?: boolean) => void;
	input: InputType;
	allowance: string;
	onApprove: () => void;
	txState: Transaction;
	setTxState: (tx: Transaction) => void;
	isPurchaseExpired: boolean;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	privatePoolDetails?: { isPrivatePool: boolean; privatePoolAmount: string };
}

const SectionDetails: FC<SectionDetailsProps> = ({
	gridItems,
	actionBoxType,
	onSubmit,
	onApprove,
	allowance,
	input = { placeholder: '0', label: 'Balance: 2000 USDC', maxValue: 2000, symbol: 'USDC' },
	txState,
	setTxState,
	isPurchaseExpired,
	setGasPrice,
	gasLimitEstimate,
	privatePoolDetails,
}) => (
	<FlexDiv>
		<Grid hasInputFields={false} gridItems={gridItems} />
		<ActionBox
			actionBoxType={actionBoxType}
			onApprove={onApprove}
			allowance={allowance}
			onSubmit={onSubmit}
			input={input}
			txState={txState}
			setTxState={setTxState}
			isPurchaseExpired={isPurchaseExpired}
			setGasPrice={setGasPrice}
			gasLimitEstimate={gasLimitEstimate}
			privatePoolDetails={privatePoolDetails}
		/>
	</FlexDiv>
);

export default SectionDetails;

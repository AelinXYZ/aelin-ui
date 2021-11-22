import { FC, MouseEventHandler } from 'react';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import ActionBox, { ActionBoxType, TransactionType } from 'components/ActionBox';
import { GridItem } from 'components/Grid/Grid';

interface SectionDetailsProps {
	gridItems: GridItem[];
	actionBoxType: ActionBoxType;
	onSubmit: (value: number, txnType: TransactionType) => void;
}

const SectionDetails: FC<SectionDetailsProps> = ({ gridItems, actionBoxType, onSubmit }) => (
	<FlexDiv>
		<Grid hasInputFields={false} gridItems={gridItems} />
		<ActionBox
			actionBoxType={actionBoxType}
			onSubmit={onSubmit}
			input={{ placeholder: '0', label: 'Balance: 2000 USDC', maxValue: 2000 }}
		/>
	</FlexDiv>
);

export default SectionDetails;

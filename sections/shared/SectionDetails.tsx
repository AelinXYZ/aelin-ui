import { FC, MouseEventHandler } from 'react';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import ActionBox from 'components/ActionBox';
import { GridItem } from 'components/Grid/Grid';

interface SectionDetailsProps {
	gridItems: GridItem[];
	isPool: boolean;
	onPurchase?: MouseEventHandler<HTMLButtonElement>;
	onAccept?: MouseEventHandler<HTMLButtonElement>;
	onWithdraw?: MouseEventHandler<HTMLButtonElement>;
}

const SectionDetails: FC<SectionDetailsProps> = ({
	gridItems,
	isPool,
	onPurchase,
	onAccept,
	onWithdraw,
}) => (
	<FlexDiv>
		<Grid hasInputFields={false} gridItems={gridItems} />
		<ActionBox
			isPool={isPool}
			onPurchase={onPurchase}
			onAccept={onAccept}
			onWithdraw={onWithdraw}
			input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
		/>
	</FlexDiv>
);

export default SectionDetails;

import { FC, MouseEventHandler } from 'react';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import ActionBox from 'components/ActionBox';
import { GridItem } from 'components/Grid/Grid';

interface SectionDetailsProps {
	gridItems: GridItem[];
	isPool: boolean;
	onSubmit: MouseEventHandler<HTMLButtonElement>;
}

const SectionDetails: FC<SectionDetailsProps> = ({ gridItems, isPool, onSubmit }) => (
	<FlexDiv>
		<Grid hasInputFields={false} gridItems={gridItems} />
		<ActionBox
			isPool={isPool}
			onSubmit={onSubmit}
			input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
		/>
	</FlexDiv>
);

export default SectionDetails;

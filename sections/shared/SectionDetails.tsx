import { FC, MouseEventHandler } from 'react';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import ActionBox from 'components/ActionBox';
import { GridItem } from 'components/Grid/Grid';

interface SectionDetailsProps {
	gridItems: GridItem[];
	isPool: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
}

const SectionDetails: FC<SectionDetailsProps> = ({ gridItems, isPool, onClick }) => (
	<FlexDiv>
		<Grid hasInputFields={false} gridItems={gridItems} />
		<ActionBox
			isPool={isPool}
			onClick={onClick}
			header={isPool ? 'Purchase' : 'Accept Deal'}
			input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
		/>
	</FlexDiv>
);

export default SectionDetails;

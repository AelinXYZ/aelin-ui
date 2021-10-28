import { FC } from 'react';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import ActionBox from 'components/ActionBox';
import { GridItem } from 'components/Grid/Grid';

interface PoolDetailsProps {
	gridItems: GridItem[];
}

const PoolDetails: FC<PoolDetailsProps> = ({ gridItems }) => (
	<FlexDiv>
		<Grid hasInputFields={false} gridItems={gridItems} />
		<ActionBox
			onClick={() => console.log('clicked me')}
			header="Purchase"
			input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
			actionText="Purchase"
		/>
	</FlexDiv>
);

export default PoolDetails;

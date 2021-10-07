import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import ActionBox from 'components/ActionBox';

const Pool: FC = () => {
	const router = useRouter();
	const { address } = router.query;
	const gridItems = useMemo(
		() => [
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
			{
				header: 'some header',
				text: 'some text',
			},
		],
		[]
	);
	return (
		<PageLayout
			title={`Pool ${address}`}
			subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque integer odio dui quisque tellus pellentesque."
		>
			<Grid hasInputFields={false} gridItems={gridItems} />
			<ActionBox
				onClick={() => console.log('clicked me')}
				header="Purchase"
				input={{ type: 'number', placeholder: '0', label: 'Balance: 2000 USDC' }}
				actionText="Purchase"
			/>
		</PageLayout>
	);
};

export default Pool;

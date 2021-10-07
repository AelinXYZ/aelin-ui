import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';

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
			<Grid gridItems={gridItems} />
		</PageLayout>
	);
};

export default Pool;

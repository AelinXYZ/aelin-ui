import { FC, useMemo } from 'react';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';

const Create: FC = () => {
	const gridItems = useMemo(
		() => [
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: 'some header',
				text: 'some text',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
		],
		[]
	);
	return (
		<PageLayout
			title={<>Create Pool</>}
			subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque integer odio dui quisque tellus pellentesque."
		>
			<Grid hasInputFields={true} gridItems={gridItems} />
		</PageLayout>
	);
};

export default Create;

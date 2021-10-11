import { FC, useMemo } from 'react';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import SummaryBox from 'components/SummaryBox';
import { FlexDiv } from 'components/common';

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
	const summaryItems = useMemo(
		() => [
			{
				label: 'some label',
				text: 'some text',
			},
			{
				label: 'some label',
				text: 'some text',
			},
			{
				label: 'some label',
				text: 'some text',
			},
			{
				label: 'some label',
				text: 'some text',
			},
			{
				label: 'some label',
				text: 'some text',
			},
			{
				label: 'some label',
				text: 'some text',
			},
			{
				label: 'some label',
				text: 'some text',
			},
			{
				label: 'some label',
				text: 'some text',
			},
		],
		[]
	);
	return (
		<PageLayout
			title={<>Create Pool</>}
			subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque integer odio dui quisque tellus pellentesque."
		>
			<FlexDiv>
				<Grid hasInputFields={true} gridItems={gridItems} />
				<SummaryBox
					onClick={() => console.log('summary box clicked')}
					summaryText="Create Pool"
					header="Pool summary"
					summaryItems={summaryItems}
				/>
			</FlexDiv>
		</PageLayout>
	);
};

export default Create;

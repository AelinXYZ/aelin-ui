import { FC, useMemo } from 'react';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import SummaryBox from 'components/SummaryBox';
import { FlexDiv } from 'components/common';
import Connector from 'containers/Connector';

const Create: FC = () => {
	const { walletAddress } = Connector.useContainer();
	const gridItems = useMemo(
		() => [
			{
				header: 'Purchase Token address',
				text: 'wETH, USDC, sUSD, etc...',
				input: {
					type: 'text',
					placeholder: '',
				},
			},
			{
				header: 'Pool Cap (Purchase Tokens)',
				text: 'Uncapped if left blank',
				input: {
					type: 'number',
					placeholder: 0,
				},
			},
			{
				header: 'Duration',
				text: 'Duration of the pool',
				input: {
					type: 'text',
					placeholder: '',
				},
			},
			{
				header: 'Sponsor Fee',
				text: 'Optional fee from 0 to 98%',
				input: {
					type: 'percent',
					placeholder: '0',
				},
			},
			{
				header: 'Name',
				text: 'Name of the pool',
				input: {
					type: 'text',
					placeholder: '',
				},
			},
			{
				header: 'Symbol',
				text: 'Symbol of the pool',
				input: {
					type: 'text',
					placeholder: '',
				},
			},
			{
				header: 'Expiry',
				text: 'Time to purchase deal tokens',
				input: {
					type: 'text',
					placeholder: '',
				},
			},
			{
				header: 'Link',
				text: 'Defaults to the pool address',
				input: {
					type: 'text',
					placeholder: 'Input',
				},
			},
			{
				header: '',
				text: '',
			},
		],
		[]
	);
	const summaryItems = useMemo(
		() => [
			{
				label: 'Sponsor',
				text: walletAddress || 'Connect Wallet',
			},
			{
				label: 'Cap:',
				text: 'some text',
			},
			{
				label: 'Currency:',
				text: 'some text',
			},
			{
				label: 'Fee:',
				text: 'some text',
			},
			{
				label: 'Duration:',
				text: 'some text',
			},
			{
				label: 'Name:',
				text: 'some text',
			},
			{
				label: 'Symbol:',
				text: 'some text',
			},
			{
				label: 'Expiry:',
				text: 'some text',
			},
		],
		[walletAddress]
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

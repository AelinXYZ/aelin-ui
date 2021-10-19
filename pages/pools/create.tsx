import { FC, useMemo } from 'react';
import { useFormik } from 'formik';
import { ethers } from 'ethers';

import { PageLayout } from 'sections/Layout';
import Grid from 'components/Grid';
import SummaryBox from 'components/SummaryBox';
import { FlexDiv } from 'components/common';
import Connector from 'containers/Connector';
import TextInput from 'components/Input/TextInput';
import Input from 'components/Input/Input';

interface CreatePoolValues {
	purchaseToken: string;
	poolName: string;
	poolSymbol: string;
	poolCap: number;
	duration: number;
	sponsorFee: number;
	purchaseExpiry: number;
}

const validate = (values: CreatePoolValues) => {
	const errors: any = {};

	if (!values.purchaseToken) {
		errors.purchaseToken = 'Required';
	} else if (!ethers.utils.isAddress(values.purchaseToken)) {
		errors.purchaseToken = 'Invalid Ethereum address';
	}

	if (!values.poolName) {
		errors.poolName = 'Required';
	} else if (values.poolName.length > 10) {
		errors.poolName = 'Must be <= 10 chars';
	}

	if (!values.poolSymbol) {
		errors.poolSymbol = 'Required';
	} else if (values.poolSymbol.length > 5) {
		errors.poolSymbol = 'Must be <= 5 chars';
	}

	return errors;
};

const Create: FC = () => {
	const { walletAddress } = Connector.useContainer();
	const formik = useFormik({
		initialValues: {
			purchaseToken: '',
			poolName: '',
			poolSymbol: '',
			poolCap: 0,
			duration: 0,
			sponsorFee: 0,
			purchaseExpiry: 0,
		},
		validate,
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
		},
	});
	const gridItems = useMemo(
		() => [
			{
				header: <label htmlFor="purchaseToken">Purchase Token address</label>,
				subText: 'wETH, USDC, sUSD, etc...',
				formField: (
					<TextInput
						id="purchaseToken"
						name="purchaseToken"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.purchaseToken}
					/>
				),
				formError: formik.errors.purchaseToken,
			},
			{
				header: <label htmlFor="poolCap">Pool Cap (Purchase Tokens)</label>,
				subText: 'Uncapped if left blank',
				formField: (
					<Input
						id="poolCap"
						name="poolCap"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.poolCap}
					/>
				),
				formError: formik.errors.poolCap,
			},
			{
				header: <label htmlFor="poolCap">Duration</label>,
				subText: 'Duration of the pool',
				formField: (
					<Input
						id="duration"
						name="duration"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.duration}
					/>
				),
				formError: formik.errors.duration,
			},
			{
				header: <label htmlFor="sponsorFee">Sponsor Fee</label>,
				subText: 'Optional fee from 0 to 98%',
				formField: (
					<Input
						id="sponsorFee"
						name="sponsorFee"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.sponsorFee}
					/>
				),
				formError: formik.errors.sponsorFee,
			},
			{
				header: <label htmlFor="sponsorFee">Name</label>,
				subText: 'Name of the pool',
				formField: (
					<TextInput
						id="poolName"
						name="poolName"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.poolName}
					/>
				),
				formError: formik.errors.poolName,
			},
			{
				header: <label htmlFor="sponsorFee">Symbol</label>,
				subText: 'Symbol of the pool',
				formField: (
					<TextInput
						id="poolSymbol"
						name="poolSymbol"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.poolSymbol}
					/>
				),
				formError: formik.errors.poolSymbol,
			},
			{
				header: <label htmlFor="purchaseExpiry">Expiry</label>,
				subText: 'Time to purchase deal tokens',
				formField: (
					<Input
						id="purchaseExpiry"
						name="purchaseExpiry"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.purchaseExpiry}
					/>
				),
				formError: formik.errors.purchaseExpiry,
			},
			{
				header: '',
				subText: '',
			},
			{
				header: '',
				subText: '',
			},
		],
		[formik]
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
			<form onSubmit={formik.handleSubmit}>
				<FlexDiv>
					<Grid hasInputFields={true} gridItems={gridItems} />
					<SummaryBox summaryText="Create Pool" header="Pool summary" summaryItems={summaryItems} />
				</FlexDiv>
			</form>
		</PageLayout>
	);
};

export default Create;

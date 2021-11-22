import { FC, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { utils } from 'ethers';

import { PageLayout } from 'sections/Layout';
import CreateForm from 'sections/shared/CreateForm';
import { FlexDivRow } from 'components/common';
import Connector from 'containers/Connector';
import ContractsInterface from 'containers/ContractsInterface';
import TransactionNotifier from 'containers/TransactionNotifier';
import TextInput from 'components/Input/TextInput';
import Input from 'components/Input/Input';
import TokenDropdown from 'components/TokenDropdown';
import { Transaction } from 'constants/transactions';

import validateCreatePool from 'utils/validate/create-pool';
import { truncateAddress } from 'utils/crypto';
import { getDuration, formatDuration } from 'utils/time';
import { CreateTxType } from 'components/SummaryBox/SummaryBox';

const Create: FC = () => {
	const { walletAddress } = Connector.useContainer();
	const { contracts } = ContractsInterface.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const [txState, setTxState] = useState<Transaction>(Transaction.PRESUBMIT);
	const [txHash, setTxHash] = useState<string | null>(null);

	const handleSubmit = async () => {
		if (!contracts || !walletAddress) return;
		const { formatBytes32String, parseEther } = utils;
		const now = new Date();
		const {
			poolCap,
			purchaseToken,
			sponsorFee,
			durationDays,
			durationHours,
			durationMinutes,
			poolName,
			poolSymbol,
			purchaseExpiryDays,
			purchaseExpiryHours,
			purchaseExpiryMinutes,
		} = formik.values;

		const duration = getDuration(now, durationDays, durationHours, durationMinutes);
		const purchaseExpiry = getDuration(
			now,
			purchaseExpiryDays,
			purchaseExpiryHours,
			purchaseExpiryMinutes
		);
		try {
			const tx = await contracts.AelinPoolFactory!.createPool(
				formatBytes32String(poolName),
				formatBytes32String(poolSymbol),
				parseEther(poolCap.toString()),
				// purchaseToken,
				// we need a kovan address for now to make it work
				'0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
				duration,
				sponsorFee.toString(),
				purchaseExpiry,
				{ gasLimit: 1000000 }
			);
			if (tx) {
				setTxState(Transaction.WAITING);
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxHash(tx.hash);
						setTxState(Transaction.SUCCESS);
					},
				});
			}
		} catch (e) {
			setTxState(Transaction.FAILED);
		}
	};

	const formik = useFormik({
		initialValues: {
			purchaseToken: '',
			poolName: '',
			poolSymbol: '',
			poolCap: 0,
			durationDays: 0,
			durationHours: 0,
			durationMinutes: 0,
			sponsorFee: 0,
			purchaseExpiryDays: 0,
			purchaseExpiryHours: 0,
			purchaseExpiryMinutes: 0,
		},
		validate: validateCreatePool,
		onSubmit: handleSubmit,
	});
	const gridItems = useMemo(
		() => [
			{
				header: <label htmlFor="purchaseToken">Purchase Token address</label>,
				subText: 'wETH, USDC, sUSD, etc...',
				formField: (
					<TokenDropdown
						id="purchaseToken"
						name="purchaseToken"
						variant={'outline'}
						onValidationError={(validationMessage) => {
							formik.setFieldError('purchaseToken', validationMessage);
						}}
						onChange={(x) => {
							formik.setFieldValue('purchaseToken', x?.value.address);
						}}
						selectedAddress={formik.values.purchaseToken}
					/>
				),
				formError: formik.errors.purchaseToken,
			},
			{
				header: <label htmlFor="poolCap">Pool Cap (Purchase Tokens)</label>,
				subText: 'Uncapped if left blank or 0',
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
				header: <label htmlFor="duration">Duration</label>,
				subText: 'Input days - hours - minutes',
				formField: (
					<FlexDivRow>
						<Input
							width="50px"
							id="durationDays"
							name="durationDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.durationDays || ''}
						/>
						<Input
							width="55px"
							id="durationHours"
							name="durationHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.durationHours || ''}
						/>
						<Input
							width="50px"
							id="durationMinutes"
							name="durationMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.durationMinutes || ''}
						/>
					</FlexDivRow>
				),
				formError: formik.errors.durationMinutes,
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
					<FlexDivRow>
						<Input
							width="50px"
							id="purchaseExpiryDays"
							name="purchaseExpiryDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseExpiryDays || ''}
						/>
						<Input
							width="55px"
							id="purchaseExpiryHours"
							name="purchaseExpiryHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseExpiryHours || ''}
						/>
						<Input
							width="50px"
							id="purchaseExpiryMinutes"
							name="purchaseExpiryMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseExpiryMinutes || ''}
						/>
					</FlexDivRow>
				),
				formError: formik.errors.purchaseExpiryMinutes,
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
				text: !!walletAddress ? truncateAddress(walletAddress ?? '') : 'Connect Wallet',
			},
			{
				label: 'Cap',
				text: formik.values.poolCap,
			},
			{
				label: 'Currency',
				text: formik.values.purchaseToken ? truncateAddress(formik.values.purchaseToken) : '',
			},
			{
				label: 'Fee',
				text: `${formik.values.sponsorFee ?? 0}%`,
			},
			{
				label: 'Duration',
				text: formatDuration(
					formik.values.durationDays,
					formik.values.durationHours,
					formik.values.durationMinutes
				),
			},
			{
				label: 'Name',
				text: formik.values.poolName,
			},
			{
				label: 'Symbol',
				text: formik.values.poolSymbol,
			},
			{
				label: 'Expiry',
				text: formatDuration(
					formik.values.purchaseExpiryDays,
					formik.values.purchaseExpiryHours,
					formik.values.purchaseExpiryMinutes
				),
			},
		],
		[walletAddress, formik]
	);
	return (
		<PageLayout title={<>CreatePool</>} subtitle="">
			<CreateForm
				formik={formik}
				gridItems={gridItems}
				summaryItems={summaryItems}
				txType={CreateTxType.CreatePool}
				txState={txState}
				txHash={txHash}
			/>
		</PageLayout>
	);
};

export default Create;

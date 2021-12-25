//@ts-nocheck
import Head from 'next/head';
import { useCallback } from 'react';
import { useFormik } from 'formik';
import { wei } from '@synthetixio/wei';
import { BigNumber, ethers, utils } from 'ethers';
import { FC, useMemo, useState, useEffect } from 'react';

import { PageLayout } from 'sections/Layout';
import CreateForm from 'sections/shared/CreateForm';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import ContractsInterface from 'containers/ContractsInterface';
import TransactionNotifier from 'containers/TransactionNotifier';

import Radio from 'components/Radio';
import Input from 'components/Input/Input';
import Whitelist from 'components/WhiteList';
import QuestionMark from 'components/QuestionMark';
import TextInput from 'components/Input/TextInput';
import TokenDropdown from 'components/TokenDropdown';
import { CreateTxType } from 'components/SummaryBox/SummaryBox';
import { FlexDivRow, FlexDivCol, Tooltip } from 'components/common';

import { Privacy, initialWhitelistValues } from 'constants/pool';
import { TransactionStatus } from 'constants/transactions';

import { truncateAddress } from 'utils/crypto';
import { getDuration, formatDuration } from 'utils/time';
import { formatNumber } from 'utils/numbers';
import validateCreatePool from 'utils/validate/create-pool';
import { scrollToBottom } from 'utils/window';
import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';

import { erc20Abi } from 'contracts/erc20';
import { DEFAULT_DECIMALS } from 'constants/defaults';

const Create: FC = () => {
	const { walletAddress, provider } = Connector.useContainer();
	const { contracts } = ContractsInterface.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { txHash, setTxHash, gasPrice, setGasPrice, txState, setTxState } =
		TransactionData.useContainer();

	const handleSubmit = async () => {
		if (!contracts || !walletAddress) return;

		const {
			poolName,
			poolSymbol,
			poolCap,
			sponsorFee,
			purchaseToken,
			duration,
			purchaseDuration,
			poolAddresses,
			poolAddressesAmounts,
		} = await createVariablesToCreatePool();

		try {
			const tx = await contracts.AelinPoolFactory!.createPool(
				poolName,
				poolSymbol,
				poolCap,
				purchaseToken,
				duration,
				sponsorFee,
				purchaseDuration,
				poolAddresses,
				poolAddressesAmounts,
				{ gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(), gasPrice: gasPrice.toBN() }
			);
			setTxState(TransactionStatus.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxHash(tx.hash);
						setTxState(TransactionStatus.SUCCESS);
					},
				});
			}
		} catch (e) {
			console.log('e', e);
			setTxState(TransactionStatus.FAILED);
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
			purchaseDurationDays: 0,
			purchaseDurationHours: 0,
			purchaseDurationMinutes: 0,
			poolPrivacy: Privacy.PUBLIC,
			whitelist: initialWhitelistValues,
		},
		validate: validateCreatePool,
		onSubmit: handleSubmit,
	});

	const createVariablesToCreatePool = useCallback(async () => {
		const { formatBytes32String, parseEther, parseUnits } = utils;
		const now = new Date();

		const {
			poolName,
			poolSymbol,
			poolCap,
			whitelist,
			sponsorFee,
			poolPrivacy,
			durationDays,
			durationHours,
			durationMinutes,
			purchaseToken,
			purchaseDurationDays,
			purchaseDurationHours,
			purchaseDurationMinutes,
		} = formik.values;

		const purchaseContract = new ethers.Contract(purchaseToken, erc20Abi, provider);
		const purchaseTokenDecimals = await purchaseContract.decimals();

		const duration = getDuration(now, durationDays, durationHours, durationMinutes);
		const purchaseDuration = getDuration(
			now,
			purchaseDurationDays,
			purchaseDurationHours,
			purchaseDurationMinutes
		);

		const isPrivate = poolPrivacy === Privacy.PRIVATE;

		let poolAddresses: string[] = [];
		let poolAddressesAmounts: BigNumber[] = [];

		if (isPrivate) {
			const formattedWhiteList = whitelist.reduce((accum, curr) => {
				const { address, amount } = curr;

				if (!address.length) return accum;

				accum.push({
					address,
					amount: amount
						? parseUnits(String(amount), purchaseTokenDecimals)
						: ethers.constants.MaxUint256,
				});

				return accum;
			}, [] as { address: string; amount: BigNumber }[]);

			poolAddresses = formattedWhiteList.map(({ address }) => address);
			poolAddressesAmounts = formattedWhiteList.map(({ amount }) => amount);
		}

		return {
			...formik.values,
			poolName: formatBytes32String(poolName),
			poolSymbol: formatBytes32String(poolSymbol),
			poolCap: parseUnits(poolCap.toString(), purchaseTokenDecimals),
			sponsorFee: parseEther(sponsorFee.toString()),
			duration,
			purchaseDuration,
			poolAddresses,
			poolAddressesAmounts,
		};
	}, [provider, formik.values]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!contracts || !walletAddress) return setGasLimitEstimate(null);

			const errors = validateCreatePool(formik.values);
			const hasError = Object.keys(errors).length !== 0;
			if (hasError) return setGasLimitEstimate(null);

			try {
				const {
					poolName,
					poolSymbol,
					poolCap,
					sponsorFee,
					purchaseToken,
					duration,
					purchaseDuration,
					poolAddresses,
					poolAddressesAmounts,
				} = await createVariablesToCreatePool();

				let gasEstimate = wei(
					await contracts.AelinPoolFactory!.estimateGas.createPool(
						poolName,
						poolSymbol,
						poolCap,
						purchaseToken,
						duration,
						sponsorFee,
						purchaseDuration,
						poolAddresses,
						poolAddressesAmounts
					),
					0
				);
				setGasLimitEstimate(gasEstimate);
			} catch (e) {
				console.log(e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [contracts, walletAddress, formik.values, createVariablesToCreatePool]);

	useEffect(() => {
		if (formik.values.poolPrivacy === Privacy.PRIVATE) {
			scrollToBottom();
		} else {
			formik.setFieldValue('whitelist', initialWhitelistValues);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.poolPrivacy]);

	const gridItems = useMemo(
		() => [
			{
				header: (
					<>
						<label htmlFor="purchaseToken">Purchase Currency</label>
						<QuestionMark text={`The currency used to purchase pool tokens`} />
					</>
				),
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
				header: (
					<>
						<label htmlFor="poolCap">Pool Cap</label>
						<QuestionMark text={`Maximum number of pool tokens`} />
					</>
				),
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
				header: (
					<>
						<label htmlFor="purchaseDuration">Purchase Window</label>
						<QuestionMark text={`The amount of time purchasers have to purchase pool tokens`} />
					</>
				),
				subText: 'Time to purchase deal tokens',
				formField: (
					<FlexDivRow>
						<Input
							width="50px"
							id="purchaseDurationDays"
							name="purchaseDurationDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseDurationDays || ''}
						/>
						<Input
							width="55px"
							id="purchaseDurationHours"
							name="purchaseDurationHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseDurationHours || ''}
						/>
						<Input
							width="50px"
							id="purchaseDurationMinutes"
							name="purchaseDurationMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseDurationMinutes || ''}
						/>
					</FlexDivRow>
				),
				formError: formik.errors.purchaseDurationMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="duration">Pool Duration</label>
						<QuestionMark
							text={`The amount of time a sponsor has to find a deal before purchasers can withdraw their funds`}
						/>
					</>
				),
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
				header: (
					<>
						<label htmlFor="sponsorFee">Sponsor Fee</label>
						<QuestionMark
							text={`The fee paid to the sponsor for each deal token redeemed, paid in deal tokens`}
						/>
					</>
				),
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
				header: <label htmlFor="name">Pool Name</label>,
				subText: 'Name of the pool token',
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
				header: <label htmlFor="symbol">Pool Symbol</label>,
				subText: 'Symbol of the pool token',
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
				header: (
					<>
						<label htmlFor="privacy">Pool Privacy</label>
						<QuestionMark
							text={`A private pool allows a sponsor to specify which address can purchase pool tokens`}
						/>
					</>
				),
				subText: 'Is the pool open or private',
				formField: (
					<FlexDivCol>
						<>
							<div role="group" aria-labelledby="pool-privacy">
								<Radio name="poolPrivacy" value={Privacy.PUBLIC} formik={formik} />
								<Radio name="poolPrivacy" value={Privacy.PRIVATE} formik={formik} />
							</div>
						</>
					</FlexDivCol>
				),
				formError: formik.errors.whitelist,
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
				text: formatNumber(formik.values.poolCap, DEFAULT_DECIMALS),
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
				label: 'Pool Locked Duration',
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
				label: 'Enter the Pool Duration',
				text: formatDuration(
					formik.values.purchaseDurationDays,
					formik.values.purchaseDurationHours,
					formik.values.purchaseDurationMinutes
				),
			},
		],
		[walletAddress, formik]
	);

	const isPrivate = formik.values.poolPrivacy === Privacy.PRIVATE;

	return (
		<>
			<Head>
				<title>Aelin - Create Pool</title>
			</Head>

			<PageLayout title={<>Create Pool</>} subtitle="">
				<>
					<CreateForm
						formik={formik}
						gridItems={gridItems}
						summaryItems={summaryItems}
						txType={CreateTxType.CreatePool}
						txState={txState}
						txHash={txHash}
						setGasPrice={setGasPrice}
						gasLimitEstimate={gasLimitEstimate}
					/>
					{isPrivate && <Whitelist formik={formik} />}
				</>
			</PageLayout>
		</>
	);
};

export default Create;

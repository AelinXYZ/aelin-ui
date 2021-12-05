import { FC, useMemo, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { BigNumber, ethers, utils } from 'ethers';
import { wei } from '@synthetixio/wei';

import { PageLayout } from 'sections/Layout';
import CreateForm from 'sections/shared/CreateForm';

import ContractsInterface from 'containers/ContractsInterface';
import TransactionNotifier from 'containers/TransactionNotifier';
import TransactionData from 'containers/TransactionData';
import Connector from 'containers/Connector';

import Radio from 'components/Radio'
import Input from 'components/Input/Input';
import WhiteList from 'components/WhiteList';
import { FlexDivRow } from 'components/common';
import TextInput from 'components/Input/TextInput';
import TokenDropdown from 'components/TokenDropdown';
import { CreateTxType } from 'components/SummaryBox/SummaryBox';

import { Transaction } from 'constants/transactions';
import { Privacy } from 'constants/pool';

import validateCreatePool from 'utils/validate/create-pool';
import { truncateAddress } from 'utils/crypto';
import { getDuration, formatDuration } from 'utils/time';

import { erc20Abi } from 'contracts/erc20';



const Create: FC = () => {
	const [isPoolPrivacyModalOpen, setPoolPrivacyModalOpen] = useState(false);

	const { walletAddress, provider } = Connector.useContainer();
	const { contracts } = ContractsInterface.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const {
		txHash,
		setTxHash,
		gasPrice,
		setGasPrice,
		gasLimitEstimate,
		setGasLimitEstimate,
		txState,
		setTxState,
	} = TransactionData.useContainer();

	const createVariablesToCreatePool = async () => {
		const { formatBytes32String, parseEther } = utils;
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
						? utils.parseUnits(String(amount), purchaseTokenDecimals)
						: ethers.constants.MaxUint256
				});
	
				return accum;
			}, [] as { address: string, amount: BigNumber }[]);

			poolAddresses = formattedWhiteList.map(({ address }) => address);
			poolAddressesAmounts = formattedWhiteList.map(({ amount }) => amount);
		}

		return {
			...formik.values,
			poolName: formatBytes32String(poolName),
			poolSymbol: formatBytes32String(poolSymbol),
			poolCap: parseEther(poolCap.toString()),
			sponsorFee: sponsorFee.toString(),
			duration,
			purchaseDuration,
			poolAddresses,
			poolAddressesAmounts,
		};
	};

	const handleSubmit = async () => {
		if (!contracts || !walletAddress) return;

		const {
			poolName,
			poolSymbol,
			poolCap,
			sponsorFee,
			// purchaseToken,
			duration,
			purchaseDuration,
			poolPrivacy,
			poolAddresses,
			poolAddressesAmounts,
		} = await createVariablesToCreatePool();

		try {
			const tx = await contracts.AelinPoolFactory!.createPool(
				poolName,
				poolSymbol,
				poolCap,
				// purchaseToken,
				// we need a kovan address for now to make it work
				// https://faucet.paradigm.xyz/ will give you this token on kovan
				'0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
				duration,
				sponsorFee.toString(),
				purchaseDuration,
				poolAddresses,
				poolAddressesAmounts,
				{ gasLimit: gasLimitEstimate?.toBN(), gasPrice: gasPrice.toBN() }
			);
			setTxState(Transaction.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxHash(tx.hash);
						setTxState(Transaction.SUCCESS);
					},
				});
			}
		} catch (e) {
			console.log('e', e);
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
			purchaseDurationDays: 0,
			purchaseDurationHours: 0,
			purchaseDurationMinutes: 0,
			poolPrivacy: Privacy.PUBLIC,
			whitelist: new Array(5).fill(
				{
					address: '',
					amount: null,
				},
			)
		},
		validate: validateCreatePool,
		onSubmit: handleSubmit,
	});

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
					// purchaseToken,
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
						// purchaseToken,
						// we need a kovan address for now to make it work
						// https://faucet.paradigm.xyz/ will give you this token on kovan
						'0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
						duration,
						sponsorFee.toString(),
						purchaseDuration,
						poolAddresses,
						poolAddressesAmounts,
					),
					0
				);

				setGasLimitEstimate(gasEstimate);
			} catch (_) {
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [contracts, walletAddress, formik.values]);

	useEffect(() => {
		if (formik.values.poolPrivacy === Privacy.PRIVATE) {
			setPoolPrivacyModalOpen(true);
		}
	}, [formik.values.poolPrivacy])

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
				header: <label htmlFor="purchaseDuration">Purchase Duration</label>,
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
				header: 'Pool Privacy',
				subText: 'Visibility of the pool',
				formField: (
					<FlexDivRow>
						<>
							<div role="group" aria-labelledby="pool-privacy">
								<Radio
									name="poolPrivacy"
									value={Privacy.PUBLIC}
									formik={formik}
								/>
								<Radio
									name="poolPrivacy"
									value={Privacy.PRIVATE}
									formik={formik}
								/>
							</div>
							<WhiteList
								formik={formik}
								setOpen={setPoolPrivacyModalOpen}
								isOpen={isPoolPrivacyModalOpen}
							/>
						</>
					</FlexDivRow>
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
					formik.values.purchaseDurationDays,
					formik.values.purchaseDurationHours,
					formik.values.purchaseDurationMinutes
				),
			},
		],
		[walletAddress, formik]
	);

	return (
		<PageLayout title={<>Create Pool</>} subtitle="">
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
		</PageLayout>
	);
};

export default Create;

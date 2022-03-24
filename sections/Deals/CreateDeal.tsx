import { FC, useEffect, useMemo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { ethers } from 'ethers';
import Wei, { wei } from '@synthetixio/wei';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';

import Input from 'components/Input/Input';
import QuestionMark from 'components/QuestionMark';
import TokenDisplay from 'components/TokenDisplay';
import TokenDropdown from 'components/TokenDropdown';
import { CreateTxType } from 'components/SummaryBox/SummaryBox';
import { FlexDivStart, FlexDivRow, FlexDiv } from 'components/common';
import DealCalculationModal from './DealCalculationModal';

import { formatNumber, numberWithCommas } from 'utils/numbers';
import { removeZeroes } from 'utils/string';
import { truncateAddress } from 'utils/crypto';
import { getGasEstimateWithBuffer } from 'utils/network';
import { getDuration, formatDuration } from 'utils/time';
import validateCreateDeal, { CreateDealValues } from 'utils/validate/create-deal';

import { erc20Abi } from 'contracts/erc20';

import CreateForm from 'sections/shared/CreateForm';

import { TransactionStatus } from 'constants/transactions';
import { GasLimitEstimate } from 'constants/networks';
import { EXCHANGE_DECIMALS } from 'constants/defaults';
import { Allocation } from 'constants/pool';

import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';
import AddressLink from 'components/AddressLink';
import Button from 'components/Button';

interface CreateDealProps {
	poolAddress: string;
	purchaseToken: string;
}

const CreateDeal: FC<CreateDealProps> = ({ poolAddress, purchaseToken }) => {
	const [dealModalIsOpen, setDealModalIsOpen] = useState<boolean>(false);
	const [totalPoolSupply, setTotalPoolSupply] = useState<Wei>(wei(0));
	const [allocation, setAllocation] = useState<Allocation>(Allocation.MAX);
	const { walletAddress, signer, provider, network } = Connector.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [cancelPoolGasLimitEstimate, setCancelPoolGasLimitEstimate] =
		useState<GasLimitEstimate>(null);
	const { txHash, setTxHash, gasPrice, setGasPrice, txState, setTxState } =
		TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const poolBalancesQuery = usePoolBalancesQuery({
		poolAddress: poolAddress,
		purchaseToken: purchaseToken,
	});

	const poolBalances = poolBalancesQuery?.data ?? null;

	const handleCancelPool = useCallback(async () => {
		if (!walletAddress || !signer) {
			return;
		}
		try {
			const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);
			const decimals = await poolContract.decimals();
			const thirtyMins = 30 * 60;
			const tx = await poolContract!.createDeal(
				purchaseToken,
				totalPoolSupply.toBN(),
				totalPoolSupply.toBN(),
				thirtyMins,
				thirtyMins,
				thirtyMins,
				0,
				walletAddress,
				thirtyMins,
				{
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				}
			);

			if (tx) {
				setTxState(TransactionStatus.WAITING);
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxHash(tx.hash);
						setTxState(TransactionStatus.SUCCESS);
					},
				});
			}
		} catch (e) {
			console.log('cancel tx e', e);
			setTxState(TransactionStatus.FAILED);
		}
	}, [
		gasLimitEstimate,
		gasPrice,
		monitorTransaction,
		poolAddress,
		purchaseToken,
		setTxHash,
		totalPoolSupply,
		signer,
		walletAddress,
		setTxState,
	]);

	const handleSubmit = async () => {
		if (!walletAddress || !signer) {
			return;
		}

		try {
			const {
				underlyingDealToken,
				underlyingDealTokenTotal,
				purchaseTokenTotal,
				purchaseTokenDecimals,
				underlyingDealTokenDecimals,
				vestingPeriodDuration,
				vestingCliffDuration,
				proRataRedemptionDuration,
				openRedemptionDuration,
				holder,
				holderFundingDuration,
			} = await createVariablesToCreateDeal();

			const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);
			const tx = await poolContract!.createDeal(
				underlyingDealToken,
				ethers.utils.parseUnits(purchaseTokenTotal.toString(), purchaseTokenDecimals),
				ethers.utils.parseUnits(underlyingDealTokenTotal.toString(), underlyingDealTokenDecimals),
				vestingPeriodDuration,
				vestingCliffDuration,
				proRataRedemptionDuration,
				openRedemptionDuration,
				holder,
				holderFundingDuration,
				{
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				}
			);

			if (tx) {
				setTxState(TransactionStatus.WAITING);
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
			underlyingDealToken: '',
			purchaseTokenTotal: 0,
			underlyingDealTokenTotal: 0,
			vestingPeriodDays: 0,
			vestingPeriodHours: 0,
			vestingPeriodMinutes: 0,
			vestingCliffDays: 0,
			vestingCliffHours: 0,
			vestingCliffMinutes: 0,
			proRataRedemptionDays: 0,
			proRataRedemptionHours: 0,
			proRataRedemptionMinutes: 0,
			openRedemptionDays: 0,
			openRedemptionHours: 0,
			openRedemptionMinutes: 0,
			holderFundingExpiryDays: 0,
			holderFundingExpiryHours: 0,
			holderFundingExpiryMinutes: 0,
			allocation: Allocation.MAX,
			holder: '',
		},
		validate: (values: CreateDealValues) =>
			validateCreateDeal(values, totalPoolSupply.toString(), network.id),
		onSubmit: handleSubmit,
	});

	const createVariablesToCreateDeal: any = useCallback(async () => {
		if (!walletAddress || !signer) {
			return;
		}
		const now = new Date();
		const {
			underlyingDealToken,
			vestingPeriodDays,
			vestingPeriodHours,
			vestingPeriodMinutes,
			vestingCliffDays,
			vestingCliffHours,
			vestingCliffMinutes,
			proRataRedemptionDays,
			proRataRedemptionHours,
			proRataRedemptionMinutes,
			openRedemptionDays,
			openRedemptionHours,
			openRedemptionMinutes,
			holderFundingExpiryDays,
			holderFundingExpiryHours,
			holderFundingExpiryMinutes,
			holder,
		} = formik.values;

		const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);
		const underlyingDealContract = new ethers.Contract(underlyingDealToken, erc20Abi, provider);

		const purchaseTokenDecimals = await poolContract.decimals();
		const underlyingDealTokenDecimals = await underlyingDealContract.decimals();

		const vestingCliffDuration = getDuration(
			now,
			vestingCliffDays,
			vestingCliffHours,
			vestingCliffMinutes
		);
		const vestingPeriodDuration = getDuration(
			now,
			vestingPeriodDays,
			vestingPeriodHours,
			vestingPeriodMinutes
		);
		const proRataRedemptionDuration = getDuration(
			now,
			proRataRedemptionDays,
			proRataRedemptionHours,
			proRataRedemptionMinutes
		);
		const openRedemptionDuration = getDuration(
			now,
			openRedemptionDays,
			openRedemptionHours,
			openRedemptionMinutes
		);
		const holderFundingDuration = getDuration(
			now,
			holderFundingExpiryDays,
			holderFundingExpiryHours,
			holderFundingExpiryMinutes
		);

		return {
			...formik.values,
			purchaseTokenDecimals,
			underlyingDealTokenDecimals,
			vestingPeriodDuration,
			vestingCliffDuration,
			proRataRedemptionDuration,
			openRedemptionDuration,
			holder,
			holderFundingDuration,
		};
	}, [formik?.values, poolAddress, provider, signer, walletAddress]);

	useEffect(() => {
		async function getTotalSupply() {
			if (signer != null && poolAddress != null && totalPoolSupply.eq(0)) {
				const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);
				const supply = await poolContract.totalSupply();
				const decimals = await poolContract.decimals();
				const poolSupply = wei(supply, decimals);
				setTotalPoolSupply(poolSupply);
				if (allocation === Allocation.MAX) {
					formik.setFieldValue('purchaseTokenTotal', removeZeroes(poolSupply.toString()));
				}
			}
		}
		getTotalSupply();
	}, [poolAddress, signer, allocation, formik, totalPoolSupply]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!walletAddress || !signer) {
				return setGasLimitEstimate(null);
			}

			const errors = validateCreateDeal(formik.values, totalPoolSupply.toString(), network.id);
			const hasError = Object.keys(errors).length !== 0;
			if (hasError) {
				return setGasLimitEstimate(null);
			}

			try {
				const {
					underlyingDealToken,
					underlyingDealTokenTotal,
					purchaseTokenTotal,
					purchaseTokenDecimals,
					underlyingDealTokenDecimals,
					vestingPeriodDuration,
					vestingCliffDuration,
					proRataRedemptionDuration,
					openRedemptionDuration,
					holder,
					holderFundingDuration,
				} = await createVariablesToCreateDeal();
				const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);
				let gasEstimate = wei(
					await poolContract!.estimateGas.createDeal(
						underlyingDealToken,
						ethers.utils.parseUnits(purchaseTokenTotal.toString(), purchaseTokenDecimals),
						ethers.utils.parseUnits(
							underlyingDealTokenTotal.toString(),
							underlyingDealTokenDecimals
						),
						vestingPeriodDuration,
						vestingCliffDuration,
						proRataRedemptionDuration,
						openRedemptionDuration,
						holder,
						holderFundingDuration
					),
					0
				);
				setGasLimitEstimate(gasEstimate);
			} catch (e) {
				console.log('create deal estimating error', e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [
		signer,
		walletAddress,
		formik.values,
		poolAddress,
		createVariablesToCreateDeal,
		setGasLimitEstimate,
		totalPoolSupply,
		network.id,
	]);

	useEffect(() => {
		const getCancelPoolGasLimitEstimate = async () => {
			if (!walletAddress || !signer) {
				return setCancelPoolGasLimitEstimate(null);
			}

			try {
				const thirtyMins = 30 * 60;
				const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);
				const decimals = await poolContract.decimals();
				let cancelGasEstimate = wei(
					await poolContract!.estimateGas.createDeal(
						purchaseToken,
						totalPoolSupply.toBN(),
						totalPoolSupply.toBN(),
						thirtyMins,
						thirtyMins,
						thirtyMins,
						0,
						walletAddress,
						thirtyMins
					),
					0
				);
				setCancelPoolGasLimitEstimate(cancelGasEstimate);
			} catch (e) {
				console.log('cancel deal estimating error', e);
				setCancelPoolGasLimitEstimate(null);
			}
		};
		getCancelPoolGasLimitEstimate();
	}, [
		signer,
		walletAddress,
		poolAddress,
		setCancelPoolGasLimitEstimate,
		purchaseToken,
		totalPoolSupply,
	]);

	const gridItems = useMemo(
		() => [
			{
				header: (
					<>
						<label htmlFor="underlyingDealToken">Underlying Deal Token</label>
						<QuestionMark
							text={`The token an investor may claim after an optional vesting period if they accept the deal`}
						/>
					</>
				),
				subText: 'address',
				formField: (
					<TokenDropdown
						id="underlyingDealToken"
						name="underlyingDealToken"
						variant={'outline'}
						onValidationError={(validationMessage) => {
							formik.setFieldError('underlyingDealToken', validationMessage);
						}}
						onChange={(x) => {
							formik.setFieldValue('underlyingDealToken', x?.value.address);
						}}
						selectedAddress={formik.values.underlyingDealToken}
					/>
				),
				formError: formik.errors.underlyingDealToken,
			},
			{
				header: (
					<>
						<label htmlFor="purchaseTokenTotal">Investment Tokens Accepted</label>
						<QuestionMark
							text={`The total amount of investment tokens eligible for the deal. Must be less than or equal to the amount in the pool`}
						/>
					</>
				),
				subText: 'amount',
				formField: (
					<div>
						<Input
							id="purchaseTokenTotal"
							name="purchaseTokenTotal"
							type="number"
							step="0.000000000000000001"
							placeholder="0"
							onChange={(e: any) => {
								if (wei(e.target.value || 0).lt(totalPoolSupply) && allocation === Allocation.MAX) {
									setAllocation(Allocation.DEALLOCATE);
								} else if (
									wei(e.target.value || 0).eq(totalPoolSupply) &&
									allocation !== Allocation.MAX
								) {
									setAllocation(Allocation.MAX);
								}

								formik.setFieldValue('purchaseTokenTotal', e.target.value);
							}}
							onBlur={formik.handleBlur}
							value={formik.values.purchaseTokenTotal ?? ''}
						/>
						<FlexDivRow>
							<AllocationRow>
								<Dot
									type="checkbox"
									onClick={() => {
										setAllocation(Allocation.MAX);
										formik.setFieldValue(
											'purchaseTokenTotal',
											removeZeroes(totalPoolSupply.toString())
										);
									}}
									checked={allocation === Allocation.MAX}
								/>{' '}
								<AllocationSpan>{Allocation.MAX}</AllocationSpan>
							</AllocationRow>
							<AllocationRow>
								<Dot
									type="checkbox"
									onClick={() => {
										setAllocation(Allocation.DEALLOCATE);
										formik.setFieldValue('purchaseTokenTotal', 0);
									}}
									checked={allocation === Allocation.DEALLOCATE}
								/>{' '}
								<AllocationSpan>{Allocation.DEALLOCATE}</AllocationSpan>
							</AllocationRow>
						</FlexDivRow>
					</div>
				),
				formError: formik.errors.purchaseTokenTotal,
			},
			{
				header: (
					<>
						<label htmlFor="underlyingDealTokenTotal">Underlying Deal Token Total</label>
						<QuestionMark text={`The total amount of underlying deal tokens in the deal`} />
					</>
				),
				subText: 'amount',
				formField: (
					<div>
						<Input
							id="underlyingDealTokenTotal"
							name="underlyingDealTokenTotal"
							type="number"
							step="0.000000000000000001"
							onChange={(e: any) =>
								formik.setFieldValue('underlyingDealTokenTotal', e.target.value)
							}
							onBlur={formik.handleBlur}
							value={formik.values.underlyingDealTokenTotal ?? ''}
						/>
						<InputButtonRow>
							<StyledButton variant="secondary" onClick={() => setDealModalIsOpen(true)}>
								Calculate
							</StyledButton>
						</InputButtonRow>
					</div>
				),
				formError: formik.errors.underlyingDealTokenTotal,
			},
			{
				header: (
					<>
						<label htmlFor="vestingCliff">Vesting Cliff</label>
						<QuestionMark
							text={`After the deal has been finalized, a period where no tokens are vesting`}
						/>
					</>
				),
				subText: 'time until vesting starts',
				formField: (
					<FlexDivStart>
						<Input
							width="50px"
							id="vestingCliffDays"
							name="vestingCliffDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.vestingCliffDays || ''}
						/>
						<Input
							width="55px"
							id="vestingCliffHours"
							name="vestingCliffHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.vestingCliffHours || ''}
						/>
						<Input
							width="50px"
							id="vestingCliffMinutes"
							name="vestingCliffMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.vestingCliffMinutes || ''}
						/>
					</FlexDivStart>
				),
				formError: formik.errors.vestingCliffMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="vestingPeriod">Vesting Period (linear)</label>
						<QuestionMark
							text={`The amount of time it takes to vest all underlying deal tokens after the vesting cliff`}
						/>
					</>
				),
				subText: 'time to vest after the cliff',
				formField: (
					<FlexDivStart>
						<Input
							width="50px"
							id="vestingPeriodDays"
							name="vestingPeriodDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.vestingPeriodDays || ''}
						/>
						<Input
							width="55px"
							id="vestingPeriodHours"
							name="vestingPeriodHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.vestingPeriodHours || ''}
						/>
						<Input
							width="50px"
							id="vestingPeriodMinutes"
							name="vestingPeriodMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.vestingPeriodMinutes || ''}
						/>
					</FlexDivStart>
				),
				formError: formik.errors.vestingPeriodMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="proRataRedemption">Round 1: Pro Rata Period</label>
						<QuestionMark
							text={`the pro rata redemption period is when an investor has the opportunity to max out their allocation for the deal`}
						/>
					</>
				),
				subText: 'the first period to accept',
				formField: (
					<FlexDivStart>
						<Input
							width="50px"
							id="proRataRedemptionDays"
							name="proRataRedemptionDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.proRataRedemptionDays || ''}
						/>
						<Input
							width="55px"
							id="proRataRedemptionHours"
							name="proRataRedemptionHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.proRataRedemptionHours || ''}
						/>
						<Input
							width="50px"
							id="proRataRedemptionMinutes"
							name="proRataRedemptionMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.proRataRedemptionMinutes || ''}
						/>
					</FlexDivStart>
				),
				formError: formik.errors.proRataRedemptionMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="openRedemption">Round 2: Open Period</label>
						<QuestionMark
							text={`the open redemption period is for investors who have maxxed their allocation in the pro rata round`}
						/>
					</>
				),
				subText: 'The second period to accept',
				formField: (
					<FlexDivStart>
						<Input
							width="50px"
							id="openRedemptionDays"
							name="openRedemptionDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.openRedemptionDays || ''}
						/>
						<Input
							width="55px"
							id="openRedemptionHours"
							name="openRedemptionHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.openRedemptionHours || ''}
						/>
						<Input
							width="50px"
							id="openRedemptionMinutes"
							name="openRedemptionMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.openRedemptionMinutes || ''}
						/>
					</FlexDivStart>
				),
				formError: formik.errors.openRedemptionMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="holderFundingExpiry">Holder funding deadline</label>
						<QuestionMark
							text={`the amount of time a holder has to finalize the deal by depositing funds. If the deadline passes the sponsor can create a new deal with a different holder.`}
						/>
					</>
				),
				subText: 'time to fund the deal',
				formField: (
					<FlexDivStart>
						<Input
							width="50px"
							id="holderFundingExpiryDays"
							name="holderFundingExpiryDays"
							type="number"
							placeholder="days"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.holderFundingExpiryDays || ''}
						/>
						<Input
							width="55px"
							id="holderFundingExpiryHours"
							name="holderFundingExpiryHours"
							type="number"
							placeholder="hours"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.holderFundingExpiryHours || ''}
						/>
						<Input
							width="50px"
							id="holderFundingExpiryMinutes"
							name="holderFundingExpiryMinutes"
							type="number"
							placeholder="mins"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.holderFundingExpiryMinutes || ''}
						/>
					</FlexDivStart>
				),
				formError: formik.errors.holderFundingExpiryMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="holder">Holder address</label>
						<QuestionMark
							text={`the address of the deal counterparty depositing the underlying deal tokens in exchange for investment tokens`}
						/>
					</>
				),
				subText: 'Address',
				formField: (
					<Input
						type="text"
						id="holder"
						name="holder"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.holder}
					/>
				),
				formError: formik.errors.holder,
			},
		],
		[formik, allocation, totalPoolSupply]
	);

	const summaryItems = useMemo(
		() => [
			{
				label: 'Underlying deal token',
				text: formik.values.underlyingDealToken ? (
					<AddressLink address={formik.values.underlyingDealToken}>
						{formik.values.underlyingDealToken
							? truncateAddress(formik.values.underlyingDealToken)
							: ''}
					</AddressLink>
				) : (
					'-'
				),
			},
			{
				label: 'Total investment tokens',
				text: formik.values.purchaseTokenTotal
					? numberWithCommas(removeZeroes(formik.values.purchaseTokenTotal.toString()))
					: '',
			},
			{
				label: 'Underlying deal token total',
				text: formik.values.underlyingDealTokenTotal
					? numberWithCommas(removeZeroes(formik.values.underlyingDealTokenTotal.toString()))
					: '',
			},
			{
				label: 'Exchange Rates',
				text:
					formik.values.purchaseTokenTotal === 0 ||
					formik.values.underlyingDealTokenTotal === 0 ||
					// @ts-ignore
					formik.values.underlyingDealTokenTotal === '' ||
					// @ts-ignore
					formik.values.purchaseTokenTotal === '' ? (
						''
					) : (
						<div>
							<ExchangeRate>
								{formatNumber(
									Number(formik.values?.underlyingDealTokenTotal ?? 0) /
										Number(formik.values?.purchaseTokenTotal ?? 0),
									EXCHANGE_DECIMALS
								)}{' '}
								<TokenDisplay address={formik.values.underlyingDealToken} /> per{' '}
								{poolBalances?.purchaseTokenSymbol}{' '}
							</ExchangeRate>
							<ExchangeRate>
								{formatNumber(
									Number(formik.values?.purchaseTokenTotal ?? 0) /
										Number(formik.values?.underlyingDealTokenTotal ?? 0),
									EXCHANGE_DECIMALS
								)}{' '}
								{poolBalances?.purchaseTokenSymbol} per{' '}
								<TokenDisplay address={formik.values.underlyingDealToken} />{' '}
							</ExchangeRate>
						</div>
					),
			},
			{
				label: 'Vesting period',
				text: formatDuration(
					formik.values.vestingPeriodDays,
					formik.values.vestingPeriodHours,
					formik.values.vestingPeriodMinutes
				),
			},
			{
				label: 'Vesting cliff',
				text: formatDuration(
					formik.values.vestingCliffDays,
					formik.values.vestingCliffHours,
					formik.values.vestingCliffMinutes
				),
			},
			{
				label: 'Pro rata period',
				text: formatDuration(
					formik.values.proRataRedemptionDays,
					formik.values.proRataRedemptionHours,
					formik.values.proRataRedemptionMinutes
				),
			},
			{
				label: 'Open period',
				text: formatDuration(
					formik.values.openRedemptionDays,
					formik.values.openRedemptionHours,
					formik.values.openRedemptionMinutes
				),
			},
			{
				label: 'Holder',
				text: formik.values.holder ? (
					<AddressLink address={formik.values.holder}>
						{formik.values.holder ? truncateAddress(formik.values.holder) : ''}
					</AddressLink>
				) : (
					'-'
				),
			},
		],
		[formik.values, poolBalances?.purchaseTokenSymbol]
	);

	return (
		<>
			<CreateForm
				formik={formik}
				gridItems={gridItems}
				summaryItems={summaryItems}
				txType={CreateTxType.CreateDeal}
				txState={txState}
				txHash={txHash}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				handleCancelPool={handleCancelPool}
				cancelGasLimitEstimate={cancelPoolGasLimitEstimate}
			/>
			<DealCalculationModal
				handleClose={() => {
					setDealModalIsOpen(false);
				}}
				setIsModalOpen={setDealModalIsOpen}
				isModalOpen={dealModalIsOpen}
				purchaseTokenSymbol={poolBalances?.purchaseTokenSymbol!}
				purchaseTokenTotal={formik.values.purchaseTokenTotal!.toString()}
				underlyingDealTokenAddress={formik.values.underlyingDealToken}
				handleValidate={(value: Wei) => {
					formik.setFieldValue('underlyingDealTokenTotal', value.toString());
					setDealModalIsOpen(false);
				}}
			/>
		</>
	);
};

const ExchangeRate = styled.div`
	margin-top: 5px;
`;

const Dot = styled.input`
	position: relative;
	cursor: pointer;

	&:before {
		content: '';
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
		background: ${(props) => props.theme.colors.primary};
		border-radius: 50%;
	}

	&:checked {
		&:before {
			width: 14px;
			height: 14px;
		}
	}

	&:after {
		content: '';
		position: absolute;
		top: -2px;
		left: -2px;
		width: 16px;
		height: 16px;
		background: ${(props) => props.theme.colors.boxesBackground};
		border: 1px solid ${(props) => props.theme.colors.borders};
		border-radius: 50%;
	}
	margin-right: 10px;
`;

const AllocationRow = styled(FlexDivStart)`
	display: flex;
	align-items: center;
	margin-top: 10px;
`;

const AllocationSpan = styled.span`
	margin-top: 5px;
	&:first-letter {
		text-transform: uppercase;
	}
`;

const StyledButton = styled(Button)`
	margin: 6px 0;
	padding: 0 12px;
`;

const InputButtonRow = styled(FlexDiv)`
	justify-content: flex-end;
`;

export default CreateDeal;

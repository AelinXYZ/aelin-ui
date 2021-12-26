import { FC, useEffect, useMemo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';

import Connector from 'containers/Connector';

import { FlexDivRow } from 'components/common';
import TextInput from 'components/Input/TextInput';
import Input from 'components/Input/Input';
import { truncateAddress } from 'utils/crypto';
import { formatNumber } from 'utils/numbers';
import { getDuration, formatDuration } from 'utils/time';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import { erc20Abi } from 'contracts/erc20';

import validateCreateDeal, { CreateDealValues } from 'utils/validate/create-deal';
import CreateForm from 'sections/shared/CreateForm';
import TokenDropdown from 'components/TokenDropdown';
import QuestionMark from 'components/QuestionMark';
import { CreateTxType } from 'components/SummaryBox/SummaryBox';
import { TransactionStatus } from 'constants/transactions';
import TransactionNotifier from 'containers/TransactionNotifier';
import TransactionData from 'containers/TransactionData';
import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';
import { DEFAULT_DECIMALS } from 'constants/defaults';

interface CreateDealProps {
	poolAddress: string;
}

const CreateDeal: FC<CreateDealProps> = ({ poolAddress }) => {
	const [totalPoolSupply, setTotalPoolSupply] = useState<number>(0);
	const { walletAddress, signer, provider } = Connector.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { txHash, setTxHash, gasPrice, setGasPrice, txState, setTxState } =
		TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const handleSubmit = async () => {
		if (!walletAddress || !signer) return;

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
				{ gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(), gasPrice: gasPrice.toBN() }
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
			holder: '',
		},
		validate: (values: CreateDealValues) => validateCreateDeal(values, totalPoolSupply),
		onSubmit: handleSubmit,
	});

	const createVariablesToCreateDeal: any = useCallback(async () => {
		if (!walletAddress || !signer) return;
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
			if (signer != null && poolAddress != null) {
				const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);
				const supply = await poolContract.totalSupply();
				const decimals = await poolContract.decimals();
				setTotalPoolSupply(Number(ethers.utils.formatUnits(supply, decimals)));
			}
		}
		getTotalSupply();
	}, [poolAddress, signer]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!walletAddress || !signer) return setGasLimitEstimate(null);

			const errors = validateCreateDeal(formik.values, totalPoolSupply);
			const hasError = Object.keys(errors).length !== 0;
			if (hasError) return setGasLimitEstimate(null);

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
	]);

	const gridItems = useMemo(
		() => [
			{
				header: (
					<>
						<label htmlFor="underlyingDealToken">Underlying Deal Token</label>
						<QuestionMark
							text={`The token a purchaser may claim after an optional vesting period if they accept the deal`}
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
						<label htmlFor="purchaseTokenTotal">Total Purchase Tokens</label>
						<QuestionMark
							text={`The total amount of purchase tokens eligible for the deal. Must be less than or equal to the amount in the pool`}
						/>
					</>
				),
				subText: 'amount',
				formField: (
					<Input
						id="purchaseTokenTotal"
						name="purchaseTokenTotal"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.purchaseTokenTotal || ''}
					/>
				),
				formError: formik.errors.purchaseTokenTotal,
			},
			{
				header: (
					<>
						<label htmlFor="underlyingDealTokenTotal">underlying Deal Token Total</label>
						<QuestionMark text={`The total amount of underlying deal tokens in the deal`} />
					</>
				),
				subText: 'amount',
				formField: (
					<Input
						id="underlyingDealTokenTotal"
						name="underlyingDealTokenTotal"
						type="number"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.underlyingDealTokenTotal || ''}
					/>
				),
				formError: formik.errors.underlyingDealTokenTotal,
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
					<FlexDivRow>
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
					</FlexDivRow>
				),
				formError: formik.errors.vestingPeriodMinutes,
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
					<FlexDivRow>
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
					</FlexDivRow>
				),
				formError: formik.errors.vestingCliffMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="proRataRedemption">Pro Rata Period</label>
						<QuestionMark
							text={`the pro rata redemption period is when a purchaser has the opportunity to max out their allocation for the deal`}
						/>
					</>
				),
				subText: 'the first period to accept',
				formField: (
					<FlexDivRow>
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
					</FlexDivRow>
				),
				formError: formik.errors.proRataRedemptionMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="openRedemption">Open Period</label>
						<QuestionMark
							text={`the open redemption period is for purchasers who have maxxed their allocation in the pro rata round`}
						/>
					</>
				),
				subText: 'The second period to accept',
				formField: (
					<FlexDivRow>
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
					</FlexDivRow>
				),
				formError: formik.errors.openRedemptionMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="holderFundingExpiry">Holder funding period</label>
						<QuestionMark
							text={`the amount of time a holder has to finalize the deal by depositing funds. If the deadline passes the sponsor can create a new deal with a different holder.`}
						/>
					</>
				),
				subText: 'holder time limit to fund',
				formField: (
					<FlexDivRow>
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
					</FlexDivRow>
				),
				formError: formik.errors.holderFundingExpiryMinutes,
			},
			{
				header: (
					<>
						<label htmlFor="holder">Holder address</label>
						<QuestionMark
							text={`the address of the deal counterparty depositing the underlying deal tokens in exchange for purchase tokens`}
						/>
					</>
				),
				subText: 'address',
				formField: (
					<TextInput
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
		[formik]
	);

	const summaryItems = useMemo(
		() => [
			{
				label: 'Underlying deal token',
				text: formik.values.underlyingDealToken
					? truncateAddress(formik.values.underlyingDealToken)
					: '',
			},
			{
				label: 'Purchase currency total:',
				text: formik.values.purchaseTokenTotal
					? formatNumber(formik.values.purchaseTokenTotal)
					: '',
			},
			{
				label: 'Underlying deal token total:',
				text: formik.values.underlyingDealTokenTotal
					? formatNumber(formik.values.underlyingDealTokenTotal)
					: '',
			},
			{
				label: 'Exchange Rates',
				text:
					// @ts-ignore
					formik.values.underlyingDealTokenTotal === '' ||
					formik.values.purchaseTokenTotal === '' ? (
						''
					) : (
						<div>
							<ExchangeRate>
								Underlying / Purchase:{' '}
								{formatNumber(
									Number(formik.values?.underlyingDealTokenTotal ?? 0) /
										Number(formik.values?.purchaseTokenTotal ?? 0),
									DEFAULT_DECIMALS
								)}
							</ExchangeRate>
							<ExchangeRate>
								Purchase / Underlying:{' '}
								{formatNumber(
									Number(formik.values?.purchaseTokenTotal ?? 0) /
										Number(formik.values?.underlyingDealTokenTotal ?? 0),
									DEFAULT_DECIMALS
								)}
							</ExchangeRate>
						</div>
					),
			},
			{
				label: 'Vesting period:',
				text: formatDuration(
					formik.values.vestingPeriodDays,
					formik.values.vestingPeriodHours,
					formik.values.vestingPeriodMinutes
				),
			},
			{
				label: 'Vesting cliff:',
				text: formatDuration(
					formik.values.vestingCliffDays,
					formik.values.vestingCliffHours,
					formik.values.vestingCliffMinutes
				),
			},
			{
				label: 'Pro rata period:',
				text: formatDuration(
					formik.values.proRataRedemptionDays,
					formik.values.proRataRedemptionHours,
					formik.values.proRataRedemptionMinutes
				),
			},
			{
				label: 'Open period:',
				text: formatDuration(
					formik.values.openRedemptionDays,
					formik.values.openRedemptionHours,
					formik.values.openRedemptionMinutes
				),
			},
			{
				label: 'Holder',
				text: formik.values.holder ? truncateAddress(formik.values.holder) : '',
			},
		],
		[formik.values]
	);

	return (
		<CreateForm
			formik={formik}
			gridItems={gridItems}
			summaryItems={summaryItems}
			txType={CreateTxType.CreateDeal}
			txState={txState}
			txHash={txHash}
			setGasPrice={setGasPrice}
			gasLimitEstimate={gasLimitEstimate}
		/>
	);
};

const ExchangeRate = styled.div`
	margin-top: 10px;
`;

export default CreateDeal;

import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import styled from 'styled-components';
import { PoolCreatedResult } from 'subgraph';
import { FC, useMemo, useCallback, useEffect, useState } from 'react';

import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import { Status } from 'components/DealStatus';
import TokenDisplay from 'components/TokenDisplay';
import QuestionMark from 'components/QuestionMark';

import { statusToText } from 'constants/pool';
import { GasLimitEstimate } from 'constants/networks';
import { DEFAULT_DECIMALS } from 'constants/defaults';
import { TransactionStatus, TransactionDealType } from 'constants/transactions';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';

import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';

import { formatNumber } from 'utils/numbers';
import { getGasEstimateWithBuffer } from 'utils/network';
import { formatShortDateWithTime, formatTimeDifference } from 'utils/time';

import AcceptOrRejectBox from '../AcceptOrRejectBox';
import { isAfter } from 'date-fns';

interface AcceptOrRejectDealProps {
	deal: any;
	pool: PoolCreatedResult | null;
	underlyingDealTokenDecimals: number | null;
	underlyingDealTokenSymbol: string | undefined;
}

const AcceptOrRejectDeal: FC<AcceptOrRejectDealProps> = ({
	deal,
	pool,
	underlyingDealTokenDecimals,
	underlyingDealTokenSymbol,
}) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { setTxState, gasPrice } = TransactionData.useContainer();

	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<number | string>('');
	const [txType, setTxType] = useState<TransactionDealType>(TransactionDealType.AcceptDeal);

	const poolBalancesQuery = usePoolBalancesQuery({
		poolAddress: pool?.id ?? null,
		purchaseToken: pool?.purchaseToken ?? null,
	});

	const poolBalances = poolBalancesQuery?.data ?? null;
	const isEmptyInput = inputValue === '' || Number(inputValue) === 0;

	const totalAmountAccepted = Number(
		ethers.utils.formatUnits(
			poolBalances?.totalAmountAccepted ?? '0',
			poolBalances?.purchaseTokenDecimals ?? 0
		)
	);
	const totalAmountWithdrawn = Number(
		ethers.utils.formatUnits(
			poolBalances?.totalAmountWithdrawn ?? '0',
			poolBalances?.purchaseTokenDecimals ?? 0
		)
	);
	const userAmountAccepted = Number(
		ethers.utils.formatUnits(
			poolBalances?.userAmountAccepted ?? '0',
			poolBalances?.purchaseTokenDecimals ?? 0
		)
	);
	const userAmountWithdrawn = Number(
		ethers.utils.formatUnits(
			poolBalances?.userAmountWithdrawn ?? '0',
			poolBalances?.purchaseTokenDecimals ?? 0
		)
	);

	const exchangeRatePurchaseUnderlying = useMemo(
		() =>
			formatNumber(
				Number(
					ethers.utils.formatUnits(
						deal?.underlyingDealTokenTotal?.toString() ?? '0',
						underlyingDealTokenDecimals ?? 0
					)
				) /
					Number(
						ethers.utils.formatUnits(
							deal?.purchaseTokenTotalForDeal?.toString() ?? '0',
							poolBalances?.purchaseTokenDecimals ?? 0
						)
					),
				DEFAULT_DECIMALS
			),
		[
			deal?.purchaseTokenTotalForDeal,
			deal?.underlyingDealTokenTotal,
			poolBalances?.purchaseTokenDecimals,
			underlyingDealTokenDecimals,
		]
	);

	const exchangeRateUnderlyingPurchase = useMemo(
		() =>
			formatNumber(
				Number(
					ethers.utils.formatUnits(
						deal?.underlyingDealTokenTotal?.toString() ?? '0',
						underlyingDealTokenDecimals ?? 0
					)
				) /
					Number(
						ethers.utils.formatUnits(
							deal?.purchaseTokenTotalForDeal?.toString() ?? '0',
							poolBalances?.purchaseTokenDecimals ?? 0
						)
					),
				DEFAULT_DECIMALS
			),
		[
			deal?.purchaseTokenTotalForDeal,
			deal?.underlyingDealTokenTotal,
			poolBalances?.purchaseTokenDecimals,
			underlyingDealTokenDecimals,
		]
	);

	const dealRedemptionPeriod = useMemo(() => {
		const now = Date.now();
		if (
			now >
			deal?.proRataRedemptionPeriodStart +
				deal?.proRataRedemptionPeriod +
				deal?.openRedemptionPeriod
		) {
			return Status.Closed;
		} else if (now > deal?.proRataRedemptionPeriodStart + deal?.proRataRedemptionPeriod) {
			return Status.OpenRedemption;
		}
		return Status.ProRataRedemption;
	}, [
		deal?.proRataRedemptionPeriodStart,
		deal?.proRataRedemptionPeriod,
		deal?.openRedemptionPeriod,
	]);

	useEffect(() => {
		if (Number(dealRedemptionPeriod)) {
			setTxType(TransactionDealType.Withdraw);
		} else {
			setTxType(TransactionDealType.AcceptDeal);
		}
	}, [dealRedemptionPeriod]);

	const areTokenSymbolsAvailable = [
		underlyingDealTokenSymbol,
		poolBalances?.purchaseTokenSymbol,
	].every((val) => val !== null && val !== '');

	const gridItems = useMemo(
		() => [
			{
				header: 'Name',
				subText: <>{deal?.name ?? ''}</>,
			},
			{
				header: 'Symbol',
				subText: <>{deal?.symbol ?? ''}</>,
			},
			{
				header: (
					<>
						<>{`Underlying Deal Token`}</>
						<QuestionMark
							text={`The token a purchaser may claim after an optional vesting period if they accept the deal`}
						/>
					</>
				),
				subText: (
					<TokenDisplay
						symbol={underlyingDealTokenSymbol}
						address={deal?.underlyingDealToken}
						displayAddress={true}
					/>
				),
			},
			{
				header: (
					<>
						<>{`Underlying Total`}</>
						<QuestionMark text={`The total amount of underlying deal tokens in the deal`} />
					</>
				),
				subText: Number(
					ethers.utils.formatUnits(
						deal?.underlyingDealTokenTotal?.toString() ?? '0',
						underlyingDealTokenDecimals ?? 0
					)
				),
			},
			{
				header: (
					<>
						<>{`Exchange Rates`}</>
						<QuestionMark
							text={`The number of underlying deal tokens a purchasers will get in exchange for a purchase token`}
						/>
					</>
				),
				subText: (
					<div>
						<ExchangeRate>
							{exchangeRateUnderlyingPurchase} {` `}
							{areTokenSymbolsAvailable
								? `${underlyingDealTokenSymbol} per ${poolBalances?.purchaseTokenSymbol}`
								: `Underlying / Purchase: `}
						</ExchangeRate>
						<ExchangeRate>
							{exchangeRatePurchaseUnderlying} {` `}
							{areTokenSymbolsAvailable
								? `${poolBalances?.purchaseTokenSymbol} per ${underlyingDealTokenSymbol}`
								: `Purchase / Underlying: `}
						</ExchangeRate>
					</div>
				),
			},
			{
				header: (
					<>
						<>{`Vesting Data`}</>
						<QuestionMark
							text={`After the vesting cliff ends there is a linear vesting period where you may claim your underlying deal tokens`}
						/>
					</>
				),
				subText: (
					<div>
						<div>
							Cliff:{' '}
							{(deal?.vestingCliff ?? 0) > 0
								? formatTimeDifference(Number(deal?.vestingCliff ?? 0))
								: '0'}
						</div>
						<div>
							Linear Period:{' '}
							{(deal?.vestingPeriod ?? 0) > 0
								? formatTimeDifference(Number(deal?.vestingPeriod))
								: '0'}
						</div>
					</div>
				),
			},
			{
				header: (
					<>
						<>{`Deal Stage`}</>
						<QuestionMark text={`The current status of the deal`} />
					</>
				),
				subText: statusToText(Status.ProRataRedemption),
			},
			{
				header: (
					<>
						<>{`Round 1 deadline`}</>
						<QuestionMark
							text={`the pro rata redemption period is when a purchaser has the opportunity to max out their allocation for the deal`}
						/>
					</>
				),
				subText: (
					<>
						{deal?.proRataRedemptionPeriodStart != null && deal?.proRataRedemptionPeriod != null ? (
							<>
								<div>
									{formatShortDateWithTime(
										deal?.proRataRedemptionPeriodStart + deal?.proRataRedemptionPeriod
									)}
								</div>
								<div>
									{!isAfter(
										new Date(deal?.proRataRedemptionPeriodStart + deal?.proRataRedemptionPeriod),
										new Date()
									) && 'Ended'}
								</div>
							</>
						) : (
							<>
								<>{formatTimeDifference(deal?.proRataRedemptionPeriod ?? 0)}</>
							</>
						)}
					</>
				),
			},
			{
				header: (
					<>
						<>{`Round 2 deadline`}</>
						<QuestionMark
							text={`the open redemption period is for purchasers who have maxxed their allocation in the pro rata round`}
						/>
					</>
				),
				subText: (
					<>
						{deal?.proRataRedemptionPeriodStart != null &&
						deal?.proRataRedemptionPeriod != null &&
						deal?.openRedemptionPeriod != null &&
						deal?.openRedemptionPeriod > 0 ? (
							<>
								<div>
									{formatShortDateWithTime(
										deal?.proRataRedemptionPeriodStart +
											deal?.proRataRedemptionPeriod +
											deal?.openRedemptionPeriod
									)}
								</div>
								<div>
									{!isAfter(
										new Date(
											deal?.proRataRedemptionPeriodStart +
												deal?.proRataRedemptionPeriod +
												deal?.openRedemptionPeriod
										),
										new Date()
									) && 'Ended'}
								</div>
							</>
						) : deal?.openRedemptionPeriod > 0 ? (
							formatTimeDifference(deal?.openRedemptionPeriod)
						) : (
							'N/A'
						)}
					</>
				),
			},
			{
				header: 'User stats',
				subText: (
					<div>
						<div>
							Remaining Pro-rata Allocation:{' '}
							{formatNumber(poolBalances?.maxProRata ?? 0, DEFAULT_DECIMALS)}
						</div>
						<div>Withdrawn: {formatNumber(userAmountWithdrawn ?? 0, DEFAULT_DECIMALS)}</div>
					</div>
				),
			},
			{
				header: 'Pool stats',
				subText: (
					<div>
						<div>
							Amount in Pool: {formatNumber(poolBalances?.totalSupply ?? 0, DEFAULT_DECIMALS)}
						</div>
						<div>Total Redeemed: {formatNumber(totalAmountAccepted ?? 0, DEFAULT_DECIMALS)}</div>
						<div>Total Withdrawn: {formatNumber(totalAmountWithdrawn ?? 0, DEFAULT_DECIMALS)}</div>
						<NoticeText>
							{(poolBalances?.totalAmountAccepted ?? '1') ===
							(deal?.purchaseTokenTotalForDeal?.toString() ?? '0')
								? 'Pool cap reached'
								: null}
						</NoticeText>
					</div>
				),
			},
			{
				header: (
					<>
						<>{`Fees Charged on Accept`}</>
						<QuestionMark
							text={`the fees a purchaser will be charged if they choose to accept the deal. Withdrawing incurs no fees`}
						/>
					</>
				),
				subText: (
					<div>
						<div>{`Sponsor Fee: ${
							pool?.sponsorFee.toString() != null
								? Number(ethers.utils.formatEther(pool?.sponsorFee.toString()))
								: 0
						}%`}</div>
						<div>Aelin Protocol Fee: 2%</div>
					</div>
				),
			},
		],
		[
			deal?.name,
			deal?.symbol,
			deal?.underlyingDealToken,
			deal?.underlyingDealTokenTotal,
			deal?.vestingCliff,
			deal?.vestingPeriod,
			deal?.proRataRedemptionPeriodStart,
			deal?.proRataRedemptionPeriod,
			deal?.openRedemptionPeriod,
			deal?.purchaseTokenTotalForDeal,
			underlyingDealTokenSymbol,
			underlyingDealTokenDecimals,
			areTokenSymbolsAvailable,
			poolBalances?.purchaseTokenSymbol,
			poolBalances?.maxProRata,
			poolBalances?.totalSupply,
			poolBalances?.totalAmountAccepted,
			exchangeRateUnderlyingPurchase,
			exchangeRatePurchaseUnderlying,
			userAmountWithdrawn,
			totalAmountAccepted,
			totalAmountWithdrawn,
			pool?.sponsorFee,
		]
	);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !deal?.poolAddress || !poolBalances?.purchaseTokenDecimals)
			return;
		const contract = new ethers.Contract(deal.poolAddress, poolAbi, signer);
		try {
			const txOptions = {
				[TransactionDealType.Withdraw]: () => {
					if (isMaxValue)
						return contract.withdrawMaxFromPool({
							gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
							gasPrice: gasPrice.toBN(),
						});

					return contract.withdrawFromPool(
						ethers.utils.parseUnits(
							(isEmptyInput ? 0 : inputValue).toString(),
							poolBalances?.purchaseTokenDecimals
						),
						{
							gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
							gasPrice: gasPrice.toBN(),
						}
					);
				},
				[TransactionDealType.AcceptDeal]: () => {
					if (isMaxValue)
						return contract.acceptMaxDealTokens({
							gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
							gasPrice: gasPrice.toBN(),
						});

					return contract.acceptDealTokens(
						ethers.utils.parseUnits(
							(isEmptyInput ? 0 : inputValue).toString(),
							poolBalances?.purchaseTokenDecimals
						),
						{
							gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
							gasPrice: gasPrice.toBN(),
						}
					);
				},
			};

			const tx: ethers.ContractTransaction = await txOptions[txType]();

			setTxState(TransactionStatus.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setInputValue('');
						setTimeout(() => {
							poolBalancesQuery.refetch();
						}, 5 * 1000);
						setTxState(TransactionStatus.SUCCESS);
					},
				});
			}
		} catch (e) {
			setTxState(TransactionStatus.FAILED);
		}
	}, [
		walletAddress,
		signer,
		deal.poolAddress,
		poolBalances?.purchaseTokenDecimals,
		txType,
		setTxState,
		isMaxValue,
		gasLimitEstimate,
		gasPrice,
		isEmptyInput,
		inputValue,
		monitorTransaction,
		poolBalancesQuery,
	]);

	useEffect(() => {
		async function getGasLimitEstimate() {
			if (!walletAddress || !signer || !deal?.poolAddress || !poolBalances?.purchaseTokenDecimals)
				return setGasLimitEstimate(null);

			const contract = new ethers.Contract(deal.poolAddress, poolAbi, signer);

			const txTypeOptions = {
				[TransactionDealType.Withdraw]: async () => {
					if (isMaxValue) {
						return setGasLimitEstimate(wei(await contract.estimateGas.withdrawMaxFromPool(), 0));
					}

					return setGasLimitEstimate(
						wei(
							await contract.estimateGas.withdrawFromPool(
								ethers.utils.parseUnits(
									(isEmptyInput ? 0 : inputValue).toString(),
									poolBalances?.purchaseTokenDecimals ?? 0
								)
							),
							0
						)
					);
				},
				[TransactionDealType.AcceptDeal]: async () => {
					if (isMaxValue) {
						return setGasLimitEstimate(wei(await contract.estimateGas.acceptMaxDealTokens(), 0));
					}

					return setGasLimitEstimate(
						wei(
							await contract.estimateGas.acceptDealTokens(
								ethers.utils.parseUnits(
									(isEmptyInput ? 0 : inputValue).toString(),
									poolBalances?.purchaseTokenDecimals ?? 0
								)
							),
							0
						)
					);
				},
			};

			txTypeOptions[txType]();
		}
		getGasLimitEstimate();
	}, [
		walletAddress,
		signer,
		deal.poolAddress,
		poolBalances?.purchaseTokenDecimals,
		inputValue,
		isMaxValue,
		isEmptyInput,
		txType,
	]);

	return (
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={gridItems} />
			<AcceptOrRejectBox
				txType={txType}
				setTxType={setTxType}
				setInputValue={setInputValue}
				setIsMaxValue={setIsMaxValue}
				inputValue={inputValue}
				onSubmit={handleSubmit}
				gasLimitEstimate={gasLimitEstimate}
				userPoolBalance={poolBalances?.userPoolBalance ?? null}
				purchaseTokenSymbol={poolBalances?.purchaseTokenSymbol ?? null}
				underlyingDealTokenSymbol={underlyingDealTokenSymbol ?? null}
				dealRedemptionData={{
					status: dealRedemptionPeriod,
					maxProRata: poolBalances?.maxProRata ?? 0,
					isOpenEligible: poolBalances?.isOpenEligible ?? false,
					totalAmountAccepted: totalAmountAccepted ?? 0,
					purchaseTokenTotalForDeal: Number(
						ethers.utils.formatUnits(
							deal?.purchaseTokenTotalForDeal?.toString() ?? '0',
							poolBalances?.purchaseTokenDecimals ?? 0
						)
					),
				}}
			/>
		</FlexDiv>
	);
};

const ExchangeRate = styled.div`
	margin-bottom: 4px;
`;

const NoticeText = styled.div`
	color: ${(props) => props.theme.colors.red};
	margin-top: 3px;
	font-size: 1.2rem;
	font-weight: bold;
`;

export default AcceptOrRejectDeal;

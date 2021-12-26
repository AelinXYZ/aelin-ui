//@ts-nocheck
import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import { ActionBoxType } from 'components/ActionBox';
import SectionDetails from 'sections/shared/SectionDetails';
import { Status } from 'components/DealStatus';
import { statusToText } from 'constants/pool';
import TokenDisplay from 'components/TokenDisplay';
import QuestionMark from 'components/QuestionMark';
import { TransactionStatus, TransactionType } from 'constants/transactions';
import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import TransactionData from 'containers/TransactionData';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';
import { PoolCreatedResult } from 'subgraph';
import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';
import { formatNumber } from 'utils/numbers';
import { DEFAULT_DECIMALS } from 'constants/defaults';
import Countdown from 'components/Countdown';

import { formatShortDateWithTime, formatTimeDifference } from 'utils/time';

interface AcceptOrRejectDealProps {
	deal: any;
	pool: PoolCreatedResult | null;
	underlyingDealTokenDecimals: number | null;
	underlyingDealTokenSymbol: string | null;
}

const AcceptOrRejectDeal: FC<AcceptOrRejectDealProps> = ({
	deal,
	pool,
	underlyingDealTokenDecimals,
	underlyingDealTokenSymbol,
}) => {
	const { walletAddress, signer, network } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { txState, setTxState, setGasPrice, gasPrice, txType, setTxType } =
		TransactionData.useContainer();
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState(0);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);

	const poolBalancesQuery = usePoolBalancesQuery({
		poolAddress: pool?.id ?? null,
		purchaseToken: pool?.purchaseToken ?? null,
	});

	const poolBalances = useMemo(() => poolBalancesQuery?.data ?? null, [poolBalancesQuery?.data]);

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

	const dealGridItems = useMemo(
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
							Underlying / Purchase:{' '}
							{formatNumber(
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
							)}
						</ExchangeRate>
						<ExchangeRate>
							Purchase / Underlying:{' '}
							{formatNumber(
								Number(
									ethers.utils.formatUnits(
										deal?.purchaseTokenTotalForDeal?.toString() ?? '0',
										poolBalances?.purchaseTokenDecimals ?? 0
									)
								) /
									Number(
										ethers.utils.formatUnits(
											deal?.underlyingDealTokenTotal?.toString() ?? '0',
											underlyingDealTokenDecimals ?? 0
										)
									),
								DEFAULT_DECIMALS
							)}
						</ExchangeRate>
					</div>
				),
			},
			{
				header: (
					<>
						<>{`Vesting Period`}</>
						<QuestionMark
							text={`After the vesting cliff, a linear vesting period where you may claim your underlying deal tokens`}
						/>
					</>
				),
				subText: (
					<>
						{(deal?.vestingPeriod ?? 0) > 0
							? formatTimeDifference(Number(deal?.vestingPeriod))
							: '0'}
					</>
				),
			},
			{
				header: (
					<>
						<>{`Vesting Cliff`}</>
						<QuestionMark
							text={`After the deal has been finalized, a period where no tokens are vesting`}
						/>
					</>
				),
				subText: (
					<>
						{(deal?.vestingCliff ?? 0) > 0
							? formatTimeDifference(Number(deal?.vestingCliff ?? 0))
							: '0'}
					</>
				),
			},
			{
				header: (
					<>
						<>{`Status`}</>
						<QuestionMark text={`The current status of the deal`} />
					</>
				),
				subText: statusToText(Status.ProRataRedemption),
			},
			{
				header: (
					<>
						<>Pro Rata Redemption</>
						<QuestionMark
							text={`the pro rata redemption period is when a purchaser has the opportunity to max out their allocation for the deal`}
						/>
					</>
				),
				subText: (
					<>
						{deal?.proRataRedemptionPeriodStart != null && deal?.proRataRedemptionPeriod != null ? (
							<>
								<Countdown
									timeStart={null}
									time={deal?.proRataRedemptionPeriodStart + deal?.proRataRedemptionPeriod}
									networkId={network.id}
								/>
								<>
									{formatShortDateWithTime(
										deal?.proRataRedemptionPeriodStart + deal?.proRataRedemptionPeriod
									)}
								</>
							</>
						) : (
							<>
								<Countdown
									timeStart={null}
									time={deal?.proRataRedemptionPeriod ?? 0}
									networkId={network.id}
								/>
								<>{formatTimeDifference(deal?.proRataRedemptionPeriod ?? 0)}</>
							</>
						)}
					</>
				),
			},
			{
				header: (
					<>
						<>Open Redemption</>
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
								<Countdown
									timeStart={deal?.proRataRedemptionPeriodStart + deal?.proRataRedemptionPeriod}
									time={
										deal?.proRataRedemptionPeriodStart +
										deal?.proRataRedemptionPeriod +
										deal?.openRedemptionPeriod
									}
									networkId={network.id}
								/>
								<>
									{formatShortDateWithTime(
										deal?.proRataRedemptionPeriodStart +
											deal?.proRataRedemptionPeriod +
											deal?.openRedemptionPeriod
									)}
								</>
							</>
						) : deal?.openRedemptionPeriod > 0 ? (
							formatTimeDifference(deal?.openRedemptionPeriod)
						) : (
							'n/a'
						)}
					</>
				),
			},
			{
				header:
					dealRedemptionPeriod === Status.OpenRedemption ? 'Total Pool Redeemed' : 'Vesting Curve',
				subText:
					dealRedemptionPeriod === Status.OpenRedemption ? (
						<>{formatNumber(poolBalances?.totalAmountAccepted ?? 0, DEFAULT_DECIMALS)}</>
					) : (
						'linear'
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
			deal?.symbol,
			deal?.name,
			deal?.underlyingDealTokenTotal,
			deal?.purchaseTokenTotalForDeal,
			deal?.vestingPeriod,
			deal?.vestingCliff,
			deal?.underlyingDealToken,
			deal?.proRataRedemptionPeriodStart,
			deal?.proRataRedemptionPeriod,
			deal?.openRedemptionPeriod,
			underlyingDealTokenDecimals,
			pool?.sponsorFee,
			poolBalances?.purchaseTokenDecimals,
			poolBalances?.totalAmountAccepted,
			underlyingDealTokenSymbol,
			network?.id,
			dealRedemptionPeriod,
		]
	);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !deal?.poolAddress || !poolBalances?.purchaseTokenDecimals)
			return;
		const contract = new ethers.Contract(deal.poolAddress, poolAbi, signer);
		try {
			let tx: ethers.ContractTransaction;
			if (txType === TransactionType.Withdraw && isMaxValue) {
				tx = await contract.withdrawMaxFromPool({
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				});
			} else if (txType === TransactionType.Withdraw) {
				tx = await contract.withdrawFromPool(
					ethers.utils.parseUnits(
						(inputValue ?? 0).toString(),
						poolBalances?.purchaseTokenDecimals
					),
					// TODO update gasPrice and gasLimit
					{
						gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
						gasPrice: gasPrice.toBN(),
					}
				);
			} else if (txType === TransactionType.Accept && isMaxValue) {
				tx = await contract.acceptMaxDealTokens({
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				});
			} else if (txType === TransactionType.Accept) {
				tx = await contract.acceptDealTokens(
					ethers.utils.parseUnits(
						(inputValue ?? 0).toString(),
						poolBalances?.purchaseTokenDecimals
					),
					{
						gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
						gasPrice: gasPrice.toBN(),
					}
				);
			} else {
				throw new Error('unexpected tx type');
			}
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => setTxState(TransactionStatus.SUCCESS),
				});
			}
		} catch (e) {
			setTxState(TransactionStatus.FAILED);
		}
	}, [
		deal?.poolAddress,
		setTxState,
		walletAddress,
		signer,
		monitorTransaction,
		poolBalances?.purchaseTokenDecimals,
		gasLimitEstimate,
		gasPrice,
		txType,
		inputValue,
		isMaxValue,
	]);

	useEffect(() => {
		async function getGasLimitEstimate() {
			if (!walletAddress || !signer || !deal?.poolAddress || !poolBalances?.purchaseTokenDecimals)
				return setGasLimitEstimate(null);
			const contract = new ethers.Contract(deal.poolAddress, poolAbi, signer);
			if (txType === TransactionType.Withdraw && isMaxValue) {
				setGasLimitEstimate(wei(await contract.estimateGas.withdrawMaxFromPool(), 0));
			} else if (txType === TransactionType.Withdraw) {
				setGasLimitEstimate(
					wei(
						await contract.estimateGas.withdrawFromPool(
							ethers.utils.parseUnits(
								(inputValue ?? 0).toString(),
								poolBalances?.purchaseTokenDecimals ?? 0
							)
						),
						0
					)
				);
			} else if (txType === TransactionType.Accept && isMaxValue) {
				setGasLimitEstimate(wei(await contract.estimateGas.acceptMaxDealTokens(), 0));
			} else if (txType === TransactionType.Accept) {
				setGasLimitEstimate(
					wei(
						await contract.estimateGas.acceptDealTokens(
							ethers.utils.parseUnits(
								(inputValue ?? 0).toString(),
								poolBalances?.purchaseTokenDecimals ?? 0
							)
						),
						0
					)
				);
			} else {
				return setGasLimitEstimate(null);
			}
		}
		getGasLimitEstimate();
	}, [
		txType,
		walletAddress,
		signer,
		deal?.poolAddress,
		poolBalances?.purchaseTokenDecimals,
		inputValue,
		isMaxValue,
	]);

	return (
		<SectionDetails
			dealRedemptionData={{
				status: dealRedemptionPeriod,
				maxProRata: poolBalances?.maxProRata ?? 0,
				isOpenEligible: poolBalances?.isOpenEligible ?? false,
				totalAmountAccepted: poolBalances?.totalAmountAccepted ?? 0,
			}}
			actionBoxType={ActionBoxType.AcceptOrRejectDeal}
			gridItems={dealGridItems}
			input={{
				placeholder: '0',
				label: `Balance ${poolBalances?.userPoolBalance} Pool Tokens`,
				maxValue: poolBalances?.userPoolBalance,
				symbol: pool?.symbol,
			}}
			txState={txState}
			setTxState={setTxState}
			onSubmit={handleSubmit}
			setGasPrice={setGasPrice}
			gasLimitEstimate={gasLimitEstimate}
			txType={txType}
			setTxType={setTxType}
			setIsMaxValue={setIsMaxValue}
			inputValue={inputValue}
			setInputValue={setInputValue}
			purchaseCurrency={pool?.purchaseToken ?? null}
		/>
	);
};

const ExchangeRate = styled.div`
	margin-bottom: 4px;
`;

export default AcceptOrRejectDeal;

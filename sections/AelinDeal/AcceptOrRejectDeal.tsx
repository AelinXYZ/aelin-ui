import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import { ActionBoxType } from 'components/ActionBox';
import SectionDetails from 'sections/shared/SectionDetails';
import { Status } from 'components/DealStatus';
import { statusToText } from 'constants/pool';
import TokenDisplay from 'components/TokenDisplay';
import { TransactionStatus, TransactionType } from 'constants/transactions';
import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import TransactionData from 'containers/TransactionData';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';
import { PoolCreatedResult } from 'subgraph';
import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';

import { formatShortDateWithTime, formatTimeDifference } from 'utils/time';

interface AcceptOrRejectDealProps {
	deal: any;
	pool: PoolCreatedResult | null;
	underlyingDealTokenDecimals: number | null;
}

const AcceptOrRejectDeal: FC<AcceptOrRejectDealProps> = ({
	deal,
	pool,
	underlyingDealTokenDecimals,
}) => {
	const { walletAddress, signer } = Connector.useContainer();
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
				header: 'Underlying Deal Token',
				subText: (
					<TokenDisplay
						symbol={deal?.symbol}
						address={deal?.underlyingDealToken}
						displayAddress={true}
					/>
				),
			},
			{
				header: 'Underlying Total',
				subText: Number(
					ethers.utils.formatUnits(
						deal?.underlyingDealTokenTotal?.toString() ?? '0',
						underlyingDealTokenDecimals ?? 0
					)
				),
			},
			{
				header: 'Exchange rate',
				subText:
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
			},
			{
				header: 'Vesting Period',
				subText: <>{formatTimeDifference(Number(deal?.vestingPeriod ?? 0))}</>,
			},
			{
				header: 'Vesting Cliff',
				subText: <>{formatTimeDifference(Number(deal?.vestingCliff ?? 0))}</>,
			},
			{
				header: 'Status',
				subText: statusToText(Status.ProRataRedemption),
			},
			{
				header: deal?.isDealFunded ? 'Pro Rata Redemption Ends' : 'Pro Rata Redemption',
				subText: (
					<>
						{deal?.proRataRedemptionPeriodStart != null && deal?.proRataRedemptionPeriod != null
							? formatShortDateWithTime(
									deal?.proRataRedemptionPeriodStart + deal?.proRataRedemptionPeriod
							  )
							: formatTimeDifference(deal?.proRataRedemptionPeriod ?? 0)}
					</>
				),
			},
			{
				header: deal?.isDealFunded ? 'Open Redemption Ends' : 'Open Redemption',
				subText: (
					<>
						{deal?.proRataRedemptionPeriodStart != null &&
						deal?.proRataRedemptionPeriod != null &&
						deal?.openRedemptionPeriod != null &&
						deal?.openRedemptionPeriod > 0
							? formatShortDateWithTime(
									deal?.proRataRedemptionPeriodStart +
										deal?.proRataRedemptionPeriod +
										deal?.openRedemptionPeriod
							  )
							: deal?.openRedemptionPeriod > 0
							? formatTimeDifference(deal?.openRedemptionPeriod)
							: 'n/a'}
					</>
				),
			},
			{
				header: 'Vesting Curve',
				subText: 'linear',
			},
			{
				header: 'Fees charged on accept',
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
			deal?.isDealFunded,
			underlyingDealTokenDecimals,
			pool?.sponsorFee,
			poolBalances?.purchaseTokenDecimals,
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

	const dealRedemptionData = useMemo(() => {
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

	return (
		<SectionDetails
			dealRedemptionData={{
				status: dealRedemptionData,
				maxProRata: poolBalances?.maxProRata ?? 0,
				isOpenEligible: poolBalances?.isOpenEligible ?? false,
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
		/>
	);
};

export default AcceptOrRejectDeal;

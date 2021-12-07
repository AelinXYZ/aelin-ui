import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ActionBoxType, TransactionType } from 'components/ActionBox';
import SectionDetails from 'sections/shared/SectionDetails';
import { Status } from 'components/DealStatus';
import { statusToText } from 'constants/pool';
import TokenDisplay from 'components/TokenDisplay';
import { Transaction } from 'constants/transactions';
import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import TransactionData from 'containers/TransactionData';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';
import { PoolCreatedResult } from 'subgraph';

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
	const { txState, setTxState, setGasPrice } = TransactionData.useContainer();

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

	const handleSubmit = useCallback(
		async (value: number, txnType: TransactionType, isMax: boolean) => {
			if (!walletAddress || !signer || !deal?.poolAddress || !poolBalances?.purchaseTokenDecimals)
				return;
			const contract = new ethers.Contract(deal.poolAddress, poolAbi, signer);
			try {
				let tx: ethers.ContractTransaction;
				if (txnType === TransactionType.Withdraw && isMax) {
					tx = await contract.withdrawMaxFromPool({
						gasLimit: 1000000,
					});
				} else if (txnType === TransactionType.Withdraw) {
					tx = await contract.withdrawFromPool(
						ethers.utils.parseUnits(value.toString(), poolBalances?.purchaseTokenDecimals),
						// TODO update gasPrice and gasLimit
						{
							gasLimit: 1000000,
						}
					);
				} else if (txnType === TransactionType.Accept && isMax) {
					tx = await contract.acceptMaxDealTokens({
						gasLimit: 1000000,
					});
				} else if (txnType === TransactionType.Accept) {
					tx = await contract.acceptDealTokens(
						ethers.utils.parseUnits(value.toString(), poolBalances?.purchaseTokenDecimals),
						{
							gasLimit: 1000000,
						}
					);
				} else {
					throw new Error('unexpected tx type');
				}
				if (tx) {
					monitorTransaction({
						txHash: tx.hash,
						onTxConfirmed: () => setTxState(Transaction.SUCCESS),
					});
				}
			} catch (e) {
				setTxState(Transaction.FAILED);
			}
		},
		[
			deal?.poolAddress,
			setTxState,
			walletAddress,
			signer,
			monitorTransaction,
			poolBalances?.purchaseTokenDecimals,
		]
	);

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
				value: '0',
				maxValue: poolBalances?.userPoolBalance,
				symbol: pool?.symbol,
			}}
			txState={txState}
			setTxState={setTxState}
			onSubmit={handleSubmit}
			setGasPrice={setGasPrice}
		/>
	);
};

export default AcceptOrRejectDeal;

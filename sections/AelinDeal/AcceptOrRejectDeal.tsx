import { FC, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import { ActionBoxType, TransactionType } from 'components/ActionBox';
import SectionDetails from 'sections/shared/SectionDetails';
import { Status } from 'components/DealStatus';
import TokenDisplay from 'components/TokenDisplay';
import { Transaction } from 'constants/transactions';
import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import TransactionData from 'containers/TransactionData';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import usePoolBalances from 'queries/pools/usePoolBalancesQuery';
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
	const { txState, setTxState } = TransactionData.useContainer();

	const { purchaseTokenDecimals, userPoolBalance } = usePoolBalances({
		poolAddress: pool?.id ?? null,
		purchaseToken: pool?.purchaseToken ?? null,
	});

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
							purchaseTokenDecimals ?? 0
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
				subText: Status.DealOpen,
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
		[deal]
	);

	const handleSubmit = useCallback(
		async (value: number, txnType: TransactionType, isMax: boolean) => {
			if (!walletAddress || !signer || !deal?.poolAddress || !purchaseTokenDecimals) return;
			const contract = new ethers.Contract(deal.poolAddress, poolAbi, signer);
			try {
				let tx: ethers.ContractTransaction;
				if (txnType === TransactionType.Withdraw && isMax) {
					tx = await contract.withdrawMaxFromPool({
						gasLimit: 1000000,
					});
				} else if (txnType === TransactionType.Withdraw) {
					tx = await contract.withdrawFromPool(
						ethers.utils.parseUnits(value.toString(), purchaseTokenDecimals),
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
						ethers.utils.parseUnits(value.toString(), purchaseTokenDecimals),
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
			purchaseTokenDecimals,
		]
	);

	const isPurchaseExpired = useMemo(() => {
		const now = Date.now();
		return deal?.proRataRedemptionPeriodStart != null
			? now >
					deal?.proRataRedemptionPeriodStart +
						deal?.proRataRedemptionPeriod +
						deal?.openRedemptionPeriod
			: false;
	}, [
		deal?.proRataRedemptionPeriodStart,
		deal?.proRataRedemptionPeriod,
		deal?.openRedemptionPeriod,
	]);

	// no balance can't buy
	// during the pro rata is ok
	// after the pro rata period if not eligible for open period
	// after the open and pro rata

	return (
		<SectionDetails
			isPurchaseExpired={isPurchaseExpired}
			actionBoxType={ActionBoxType.AcceptOrRejectDeal}
			gridItems={dealGridItems}
			input={{
				placeholder: '0',
				label: `Balance ${userPoolBalance} Pool Tokens`,
				value: '0',
				maxValue: userPoolBalance,
				symbol: pool?.symbol,
			}}
			txState={txState}
			setTxState={setTxState}
			onSubmit={handleSubmit}
		/>
	);
};

export default AcceptOrRejectDeal;

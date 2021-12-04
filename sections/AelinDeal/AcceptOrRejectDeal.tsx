import { FC, useMemo, useState, useCallback, useEffect } from 'react';
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
import usePoolBalances from 'hooks/usePoolBalances';
import { PoolCreatedResult } from 'subgraph';
import { getERC20Data } from 'utils/crypto';
import { formatShortDateWithTime, formatTimeDifference } from 'utils/time';

interface AcceptOrRejectDealProps {
	deal: any;
	pool: PoolCreatedResult | null;
}

const AcceptOrRejectDeal: FC<AcceptOrRejectDealProps> = ({ deal, pool }) => {
	const { walletAddress, signer, provider } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { txState, setTxState } = TransactionData.useContainer();
	const [underlyingDealTokenDecimals, setUnderlyingDealTokenDecimals] = useState<number | null>(
		null
	);

	const { purchaseTokenDecimals, userPoolBalance } = usePoolBalances({
		poolAddress: pool?.id ?? null,
		purchaseToken: pool?.purchaseToken ?? null,
	});
	useEffect(() => {
		async function getDecimals() {
			if (deal?.underlyingDealToken != null) {
				const { decimals } = await getERC20Data({ address: deal?.underlyingDealToken, provider });
				setUnderlyingDealTokenDecimals(decimals);
			}
		}
		getDecimals();
	}, [deal?.underlyingDealToken, provider]);

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
				subText: 0,
			},
			{
				header: 'Exchange rate',
				subText: 0,
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

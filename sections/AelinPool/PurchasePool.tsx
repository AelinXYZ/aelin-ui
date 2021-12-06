import { FC, useMemo, useState, useCallback, useEffect } from 'react';

import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import SectionDetails from 'sections/shared/SectionDetails';
import { ActionBoxType } from 'components/ActionBox';
import Ens from 'components/Ens';
import { PoolCreatedResult } from 'subgraph';
import { ethers } from 'ethers';
import { erc20Abi } from 'contracts/erc20';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import { Transaction } from 'constants/transactions';
import TokenDisplay from 'components/TokenDisplay';
import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';
import { formatShortDateWithTime } from 'utils/time';
import TransactionData from 'containers/TransactionData';
import { wei } from '@synthetixio/wei';

interface PurchasePoolProps {
	pool: PoolCreatedResult | null;
}

const PurchasePool: FC<PurchasePoolProps> = ({ pool }) => {
	const { walletAddress, signer } = Connector.useContainer();
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

	const poolBalancesQuery = usePoolBalancesQuery({
		poolAddress: pool?.id ?? null,
		purchaseToken: pool?.purchaseToken ?? null,
	});

	const poolBalances = poolBalancesQuery?.data ?? null;
	const purchaseTokenDecimals = poolBalances?.purchaseTokenDecimals ?? null;
	const purchaseTokenSymbol = poolBalances?.purchaseTokenSymbol ?? null;
	const purchaseTokenAllowance = poolBalances?.purchaseTokenAllowance ?? null;
	const userPurchaseBalance = poolBalances?.userPurchaseBalance ?? null;
	const userPoolBalance = poolBalances?.userPoolBalance ?? null;

	const contract = useMemo(() => {
		if (!pool || !pool.purchaseToken || !signer) return null;
		return new ethers.Contract(pool.purchaseToken, erc20Abi, signer);
	}, [pool, signer]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!contract || !pool || !pool.id) return;
			try {
				if (!Number(purchaseTokenAllowance)) {
					setGasLimitEstimate(
						wei(await contract.estimateGas.approve(pool.id, ethers.constants.MaxUint256), 0)
					);
					console.log(
						'approve',
						(await contract.estimateGas.approve(pool.id, ethers.constants.MaxUint256)).toString()
					);
				} else {
					if (!purchaseTokenDecimals) return;
					console.log('not approve');
					setGasLimitEstimate(
						wei(
							await contract.purchasePoolTokens(
								ethers.utils.parseUnits('1', purchaseTokenDecimals),
								0
							)
						)
					);
				}
			} catch (e) {
				console.log(e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [contract, pool, purchaseTokenAllowance, purchaseTokenDecimals]);

	const poolGridItems = useMemo(
		() => [
			{
				header: 'Sponsor',
				subText: <Ens address={pool?.sponsor ?? ''} />,
			},
			{
				header: `My ${purchaseTokenSymbol} Balance`,
				subText: userPurchaseBalance,
			},
			{
				header: 'Purchase Token Cap',
				subText: ethers.utils
					.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
					.toString(),
			},
			{
				header: 'Purchase Token',
				subText: (
					<TokenDisplay
						displayAddress={true}
						symbol={purchaseTokenSymbol}
						address={pool?.purchaseToken ?? ''}
					/>
				),
			},
			{
				header: 'My Pool Balance',
				subText: userPoolBalance,
			},
			{
				header: 'Total Contributions',
				subText: ethers.utils
					.formatUnits(pool?.contributions.toString() ?? '0', purchaseTokenDecimals ?? 0)
					.toString(),
			},
			{
				header: 'Sponsor Fee',
				subText: pool?.sponsorFee || 0,
			},
			{
				header: 'Purchase Expiration',
				subText: <>{formatShortDateWithTime(pool?.purchaseExpiry ?? 0)}</>,
			},
			{
				header: 'Pool Duration',
				subText: (
					<>{formatShortDateWithTime((pool?.purchaseExpiry ?? 0) + (pool?.duration ?? 0))}</>
				),
			},
		],
		[pool, userPoolBalance, userPurchaseBalance, purchaseTokenSymbol, purchaseTokenDecimals]
	);

	const handleSubmit = useCallback(
		async (value: number) => {
			if (!walletAddress || !signer || !pool?.id || !purchaseTokenDecimals) return;
			const contract = new ethers.Contract(pool.id, poolAbi, signer);
			try {
				const tx = await contract.purchasePoolTokens(
					ethers.utils.parseUnits(value.toString(), purchaseTokenDecimals),
					{
						gasLimit: gasLimitEstimate,
						gasPrice,
					}
				);
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
		[walletAddress, signer, monitorTransaction, pool?.id, purchaseTokenDecimals]
	);

	const handleApprove = useCallback(async () => {
		if (!walletAddress || !signer || !pool?.id || !pool?.purchaseToken) return;
		const contract = new ethers.Contract(pool.purchaseToken, erc20Abi, signer);
		try {
			const tx = await contract.approve(
				pool.id,
				ethers.constants.MaxUint256,
				// TODO update gasPrice and gasLimit
				{
					gasLimit: 1000000,
				}
			);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxState(Transaction.SUCCESS);
						setTimeout(() => {
							poolBalancesQuery.refetch();
							console.log('refetch');
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			setTxState(Transaction.FAILED);
		}
	}, [pool?.id, pool?.purchaseToken, monitorTransaction, walletAddress, signer]);

	const isPurchaseExpired = useMemo(() => Date.now() > Number(pool?.purchaseExpiry ?? 0), [
		pool?.purchaseExpiry,
	]);

	return (
		<SectionDetails
			isPurchaseExpired={isPurchaseExpired}
			actionBoxType={ActionBoxType.FundPool}
			gridItems={poolGridItems}
			input={{
				placeholder: '0',
				label: `Balance ${userPurchaseBalance} ${purchaseTokenSymbol}`,
				value: '0',
				maxValue: userPurchaseBalance,
				symbol: purchaseTokenSymbol,
			}}
			allowance={purchaseTokenAllowance}
			onApprove={handleApprove}
			onSubmit={handleSubmit}
			txState={txState}
			setTxState={setTxState}
			setGasPrice={setGasPrice}
			gasLimitEstimate={gasLimitEstimate}
		/>
	);
};

export default PurchasePool;

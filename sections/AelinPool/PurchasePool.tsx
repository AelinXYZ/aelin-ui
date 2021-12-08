import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import { PoolCreatedResult } from 'subgraph';
import { FC, useMemo, useCallback, useEffect, useState } from 'react';

import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';

import SectionDetails from 'sections/shared/SectionDetails';

import Ens from 'components/Ens';
import { Status } from 'components/DealStatus';
import { FlexDivStart } from 'components/common';
import TokenDisplay from 'components/TokenDisplay';
import { ActionBoxType } from 'components/ActionBox';
import CopyToClipboard from 'components/CopyToClipboard';

import { erc20Abi } from 'contracts/erc20';

import { Transaction } from 'constants/transactions';

import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';

import { formatShortDateWithTime } from 'utils/time';

import TransactionData from 'containers/TransactionData';

import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';

interface PurchasePoolProps {
	pool: PoolCreatedResult | null;
}

const PurchasePool: FC<PurchasePoolProps> = ({ pool }) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);

	const { gasPrice, setGasPrice, txState, setTxState } = TransactionData.useContainer();

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
	const isPrivatePool = poolBalances?.isPrivatePool ?? null;
	const privatePoolAmount = poolBalances?.privatePoolAmount ?? null;

	const tokenContract = useMemo(() => {
		if (!pool || !pool.purchaseToken || !signer) return null;
		return new ethers.Contract(pool.purchaseToken, erc20Abi, signer);
	}, [pool, signer]);

	const poolContract = useMemo(() => {
		if (!pool || !pool.purchaseToken || !signer) return null;
		return new ethers.Contract(pool.id, poolAbi, signer);
	}, [pool, signer]);

	const maxValue = useMemo(() => {
		const contributions = Number(
			ethers.utils
				.formatUnits(pool?.contributions.toString() ?? '0', purchaseTokenDecimals ?? 0)
				.toString()
		);
		const purchaseCap = Number(
			ethers.utils
				.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
				.toString()
		);
		return Math.min(Number(userPurchaseBalance), Math.max(purchaseCap - contributions, 0));
	}, [userPurchaseBalance, pool?.purchaseTokenCap, purchaseTokenDecimals, pool?.contributions]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (
				!poolContract ||
				!tokenContract ||
				!pool ||
				!pool.id ||
				(pool?.status ?? Status.PoolOpen) !== Status.PoolOpen
			)
				return;
			try {
				if (!Number(purchaseTokenAllowance)) {
					setGasLimitEstimate(
						wei(await tokenContract.estimateGas.approve(pool.id, ethers.constants.MaxUint256), 0)
					);
				} else {
					if (!purchaseTokenDecimals) return;
					setGasLimitEstimate(
						wei(
							await poolContract.estimateGas.purchasePoolTokens(
								ethers.utils.parseUnits(maxValue.toString(), purchaseTokenDecimals)
							),
							0
						)
					);
				}
			} catch (e) {
				console.log(e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [
		poolContract,
		pool,
		purchaseTokenAllowance,
		purchaseTokenDecimals,
		tokenContract,
		setGasLimitEstimate,
		maxValue,
	]);

	const poolGridItems = useMemo(
		() => [
			{
				header: 'Sponsor',
				subText: (
					<FlexDivStart>
						<Ens address={pool?.sponsor ?? ''} />
						{pool?.sponsor && <CopyToClipboard text={pool?.sponsor} />}
					</FlexDivStart>
				),
			},
			{
				header: `My ${purchaseTokenSymbol} Balance`,
				subText: userPurchaseBalance,
			},
			{
				header: 'Purchase Token Cap',
				subText: Number(
					ethers.utils
						.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
						.toString()
				),
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
				subText: `${
					pool?.sponsorFee.toString() != null
						? Number(ethers.utils.formatEther(pool?.sponsorFee.toString()))
						: 0
				}%`,
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
			if (!walletAddress || !signer || !pool?.id || !purchaseTokenDecimals || !poolContract) return;
			try {
				const tx = await poolContract.purchasePoolTokens(
					ethers.utils.parseUnits(value.toString(), purchaseTokenDecimals),
					{
						gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
						gasPrice: gasPrice.toBN(),
					}
				);
				setTxState(Transaction.WAITING);
				if (tx) {
					monitorTransaction({
						txHash: tx.hash,
						onTxConfirmed: () => {
							setTimeout(() => {
								poolBalancesQuery.refetch();
							}, 5 * 1000);
							setTxState(Transaction.SUCCESS);
						},
					});
				}
			} catch (e) {
				console.log(e);
				setTxState(Transaction.FAILED);
			}
		},
		[walletAddress, signer, monitorTransaction, pool?.id, purchaseTokenDecimals]
	);

	const handleApprove = useCallback(async () => {
		if (!walletAddress || !signer || !pool?.id || !pool?.purchaseToken || !tokenContract) return;
		try {
			const tx = await tokenContract.approve(pool.id, ethers.constants.MaxUint256, {
				gasLimit: gasLimitEstimate?.toBN(),
				gasPrice: gasPrice.toBN(),
			});
			setTxState(Transaction.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxState(Transaction.SUCCESS);
						setTimeout(() => {
							poolBalancesQuery.refetch();
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
			setTxState(Transaction.FAILED);
		}
	}, [
		pool?.id,
		pool?.purchaseToken,
		monitorTransaction,
		gasLimitEstimate,
		poolBalancesQuery,
		gasPrice,
		setTxState,
		tokenContract,
		walletAddress,
		signer,
	]);

	const isPurchaseExpired = useMemo(
		() => Date.now() > Number(pool?.purchaseExpiry ?? 0),
		[pool?.purchaseExpiry]
	);

	return (
		<SectionDetails
			privatePoolDetails={{ isPrivatePool, privatePoolAmount }}
			isPurchaseExpired={isPurchaseExpired}
			actionBoxType={ActionBoxType.FundPool}
			gridItems={poolGridItems}
			input={{
				placeholder: '0',
				label: `Balance ${userPurchaseBalance} ${purchaseTokenSymbol}`,
				value: '0',
				maxValue,
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

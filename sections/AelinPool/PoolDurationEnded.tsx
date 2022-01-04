//@ts-nocheck
import { ethers } from 'ethers';
import { PoolCreatedResult } from 'subgraph';
import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { wei } from '@synthetixio/wei';

import { FlexDiv, Notice } from 'components/common';
import Grid from 'components/Grid';
import ActionBox, { ActionBoxType } from 'components/ActionBox';
import TokenDisplay from 'components/TokenDisplay';
import QuestionMark from 'components/QuestionMark';

import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';

import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';

import { formatShortDateWithTime } from 'utils/time';
import { formatNumber } from 'utils/numbers';

import TransactionData from 'containers/TransactionData';

import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';
import { DEFAULT_DECIMALS } from 'constants/defaults';
import { TransactionType, TransactionStatus } from 'constants/transactions';

interface PoolDurationEndedProps {
	pool: PoolCreatedResult | null;
}

const PoolDurationEnded: FC<PoolDurationEndedProps> = ({ pool }) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);

	const { gasPrice, setGasPrice, txState, setTxState, txType, setTxType } =
		TransactionData.useContainer();
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState(0);

	useEffect(() => setTxType(TransactionType.Withdraw), []);

	const poolContract = useMemo(() => {
		if (!pool || !pool.purchaseToken || !signer) return null;
		return new ethers.Contract(pool.id, poolAbi, signer);
	}, [pool, signer]);

	const poolBalancesQuery = usePoolBalancesQuery({
		poolAddress: pool?.id ?? null,
		purchaseToken: pool?.purchaseToken ?? null,
	});
	const poolBalances = poolBalancesQuery?.data ?? null;
	const purchaseTokenSymbol = poolBalances?.purchaseTokenSymbol ?? null;
	const purchaseTokenDecimals = poolBalances?.purchaseTokenDecimals ?? null;
	const userPurchaseBalance = poolBalances?.userPurchaseBalance ?? null;
	const userPoolBalance = poolBalances?.userPoolBalance ?? null;

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!poolContract || !pool.id || !walletAddress || !signer || !purchaseTokenDecimals) {
				return setGasLimitEstimate(null);
			}
			try {
				if (isMaxValue) {
					setGasLimitEstimate(wei(await poolContract.estimateGas.withdrawMaxFromPool(), 0));
				} else {
					const amount = ethers.utils.parseUnits(
						(inputValue ?? 0).toString(),
						purchaseTokenDecimals
					);
					setGasLimitEstimate(wei(await poolContract.estimateGas.withdrawFromPool(amount), 0));
				}
			} catch (e) {
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [
		poolContract,
		pool,
		purchaseTokenDecimals,
		setGasLimitEstimate,
		inputValue,
		isMaxValue,
		signer,
		walletAddress,
	]);

	const handleSubmit = useCallback(async () => {
		if (!poolContract || !pool.id || !walletAddress || !signer || !purchaseTokenDecimals) {
			return;
		}
		try {
			let tx: ethers.ContractTransaction;
			if (isMaxValue) {
				tx = await poolContract.withdrawMaxFromPool({
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				});
			} else {
				tx = await poolContract.withdrawFromPool(
					ethers.utils.parseUnits((inputValue ?? 0).toString(), purchaseTokenDecimals),
					{
						gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
						gasPrice: gasPrice.toBN(),
					}
				);
			}
			setTxState(TransactionStatus.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
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
		setTxState,
		walletAddress,
		signer,
		monitorTransaction,
		gasLimitEstimate,
		gasPrice,
		inputValue,
		isMaxValue,
		poolBalancesQuery,
		poolContract,
		pool?.id,
		purchaseTokenDecimals,
	]);

	const withdrawGridItems = useMemo(
		() => [
			{
				header: (
					<span>
						My{' '}
						<TokenDisplay
							displayAddress={false}
							symbol={purchaseTokenSymbol}
							address={pool?.purchaseToken ?? ''}
						/>
						Balance
					</span>
				),
				subText: formatNumber(userPurchaseBalance ?? '0', DEFAULT_DECIMALS),
			},
			{
				header: (
					<>
						<>{`My pool balance`}</>
						<QuestionMark text={`The number of purchase tokens you have deposited`} />
					</>
				),
				subText: formatNumber(userPoolBalance ?? '0', DEFAULT_DECIMALS),
			},
			{
				header: (
					<>
						<>{`Pool Duration Ends`}</>
						<QuestionMark
							text={`The amount of time a sponsor has to find a deal before purchasers can withdraw their funds`}
						/>
					</>
				),
				subText: (
					<>
						<>{formatShortDateWithTime((pool?.purchaseExpiry ?? 0) + (pool?.duration ?? 0))}</>
					</>
				),
			},
		],
		[
			userPoolBalance,
			pool?.purchaseToken,
			userPurchaseBalance,
			purchaseTokenSymbol,
			pool?.purchaseExpiry,
			pool?.duration,
		]
	);

	return (
		<>
			<FlexDiv>
				<Grid hasInputFields={false} gridItems={withdrawGridItems} />
				<ActionBox
					actionBoxType={ActionBoxType.Withdraw}
					onSubmit={() => handleSubmit()}
					input={{
						placeholder: '0',
						label: `Balance ${userPoolBalance} Pool Tokens`,
						maxValue: userPoolBalance ?? 0,
					}}
					inputValue={inputValue}
					setInputValue={setInputValue}
					setIsMaxValue={setIsMaxValue}
					txState={txState}
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
					txType={txType}
					setTxType={setTxType}
					purchaseCurrency={purchaseTokenSymbol}
				/>
			</FlexDiv>
			<Notice>
				The duration for this AELIN pool has ended. You may withdraw your funds now although the
				sponsor may still create a deal for you if you remain in the pool
			</Notice>
		</>
	);
};

export default PoolDurationEnded;

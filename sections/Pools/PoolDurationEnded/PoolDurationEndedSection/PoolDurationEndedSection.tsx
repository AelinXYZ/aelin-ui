//@ts-nocheck
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import { PoolCreatedResult } from 'subgraph';
import { FC, useMemo, useCallback, useEffect, useState } from 'react';

import Grid from 'components/Grid';
import TokenDisplay from 'components/TokenDisplay';
import QuestionMark from 'components/QuestionMark';
import { FlexDiv } from 'components/common';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';

import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';

import { formatNumber } from 'utils/numbers';
import { formatShortDateWithTime } from 'utils/time';
import { getGasEstimateWithBuffer } from 'utils/network';

import { GasLimitEstimate } from 'constants/networks';
import { DEFAULT_DECIMALS } from 'constants/defaults';
import { TransactionStatus } from 'constants/transactions';

import PoolDurationEndedBox from '../PoolDurationEndedBox';

interface PoolDurationEndedProps {
	pool: PoolCreatedResult | null;
	dealID: string;
}

const PoolDurationEnded: FC<PoolDurationEndedProps> = ({ pool, dealID }) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { gasPrice, setTxState } = TransactionData.useContainer();

	const [inputValue, setInputValue] = useState<number | string>('');
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);

	const poolContract = useMemo(() => {
		if (!pool || !pool.purchaseToken || !signer) {
			return null;
		}
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
						<>{`Deal deadline`}</>
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
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={withdrawGridItems} />
			<PoolDurationEndedBox
				onSubmit={handleSubmit}
				inputValue={inputValue}
				setInputValue={setInputValue}
				setIsMaxValue={setIsMaxValue}
				userPoolBalance={userPoolBalance}
				gasLimitEstimate={gasLimitEstimate}
				purchaseTokenSymbol={purchaseTokenSymbol}
			/>
		</FlexDiv>
	);
};

export default PoolDurationEnded;

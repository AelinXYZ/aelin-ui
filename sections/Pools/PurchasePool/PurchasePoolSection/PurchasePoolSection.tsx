//@ts-nocheck
import { ethers } from 'ethers';
import Wei, { wei } from '@synthetixio/wei';
import { PoolCreatedResult } from 'subgraph';
import { FC, useMemo, useCallback, useEffect, useState } from 'react';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';

import Ens from 'components/Ens';
import Grid from 'components/Grid';
import { Status } from 'components/DealStatus';
import QuestionMark from 'components/QuestionMark';
import TokenDisplay from 'components/TokenDisplay';
import CopyToClipboard from 'components/CopyToClipboard';
import { FlexDivStart, FlexDiv } from 'components/common';

import { erc20Abi } from 'contracts/erc20';

import usePoolBalancesQuery from 'queries/pools/usePoolBalancesQuery';

import { formatNumber } from 'utils/numbers';
import { formatShortDateWithTime, showDateOrMessageIfClosed } from 'utils/time';
import { getGasEstimateWithBuffer } from 'utils/network';

import { GasLimitEstimate } from 'constants/networks';
import { DEFAULT_DECIMALS } from 'constants/defaults';
import { TransactionPurchaseType, TransactionStatus } from 'constants/transactions';

import PurchasePoolBox from '../PurchasePoolBox';
import { isAfter } from 'date-fns';

interface PurchasePoolProps {
	pool: PoolCreatedResult | null;
}

const PurchasePool: FC<PurchasePoolProps> = ({ pool }) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);

	const { gasPrice, setTxState } = TransactionData.useContainer();
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string | number>('');
	const [txType, setTxType] = useState<TransactionPurchaseType>(TransactionPurchaseType.Allowance);

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

	const isEmptyInput = inputValue === '' || Number(inputValue) === 0;
	const hasAllowance = Number(purchaseTokenAllowance ?? 0) !== 0;

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
		return purchaseCap > 0
			? Math.min(Number(userPurchaseBalance), Math.max(purchaseCap - contributions, 0))
			: Number(userPurchaseBalance);
	}, [userPurchaseBalance, pool?.purchaseTokenCap, purchaseTokenDecimals, pool?.contributions]);

	const maxValueBN = useMemo(() => {
		if (!purchaseTokenDecimals) return wei(0);
		const contribution = wei(
			ethers.utils
				.formatUnits(pool?.contributions.toString() ?? '0', purchaseTokenDecimals ?? 0)
				.toString(),
			purchaseTokenDecimals
		);

		const purchaseCap = wei(
			ethers.utils
				.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
				.toString(),
			purchaseTokenDecimals
		);

		const publicPoolMaxBN = purchaseCap.gt(wei(0))
			? Wei.min(
					wei(userPurchaseBalance, purchaseTokenDecimals),
					Wei.max(purchaseCap.sub(contribution), 0)
			  )
			: wei(userPurchaseBalance, purchaseTokenDecimals);

		return isPrivatePool
			? Wei.min(publicPoolMaxBN, wei(privatePoolAmount, purchaseTokenDecimals))
			: publicPoolMaxBN;
	}, [
		privatePoolAmount,
		userPurchaseBalance,
		pool?.purchaseTokenCap,
		purchaseTokenDecimals,
		pool?.contributions,
		isPrivatePool,
	]);

	useEffect(() => {
		setTxType(hasAllowance ? TransactionPurchaseType.Purchase : TransactionPurchaseType.Allowance);
	}, [hasAllowance, setTxType]);

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
					const amount = isMaxValue
						? maxValueBN.toBN()
						: ethers.utils.parseUnits(
								(isEmptyInput ? 0 : inputValue).toString(),
								purchaseTokenDecimals
						  );
					setGasLimitEstimate(wei(await poolContract.estimateGas.purchasePoolTokens(amount), 0));
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
		inputValue,
		isEmptyInput,
		isMaxValue,
		maxValueBN,
	]);

	const gridItems = useMemo(
		() => [
			{
				header: (
					<>
						<>{`Investment token`}</>
						<QuestionMark text={`The currency used to purchase pool tokens`} />
					</>
				),
				subText: (
					<TokenDisplay
						displayAddress={true}
						symbol={purchaseTokenSymbol}
						address={pool?.purchaseToken ?? ''}
					/>
				),
			},
			{
				header: (
					<>
						<>{`Pool Cap`}</>
						<QuestionMark text={`Maximum number of pool tokens`} />
					</>
				),
				subText:
					Number(pool?.purchaseTokenCap.toString()) > 0
						? formatNumber(
								ethers.utils
									.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
									.toString(),
								DEFAULT_DECIMALS
						  )
						: 'Uncapped',
			},
			{
				header: (
					<>
						<>{`Pool stats`}</>
						<QuestionMark
							text={`The total amount of tokens all purchasers have deposited, withdrawn and the remaining amount in the pool`}
						/>
					</>
				),
				subText: (
					<>
						<div>
							Funded:{' '}
							{formatNumber(
								ethers.utils
									.formatUnits(pool?.contributions.toString() ?? '0', purchaseTokenDecimals ?? 0)
									.toString(),
								DEFAULT_DECIMALS
							)}
						</div>
						<div>
							Withdrawn:{' '}
							{formatNumber(
								ethers.utils
									.formatUnits(
										poolBalances?.totalAmountWithdrawn ?? '0',
										purchaseTokenDecimals ?? 0
									)
									.toString(),
								DEFAULT_DECIMALS
							)}
						</div>
						<div>
							Amount in pool: {formatNumber(poolBalances?.totalSupply ?? 0, DEFAULT_DECIMALS)}
						</div>
					</>
				),
			},
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
						<>{`Investment deadline`}</>
						<QuestionMark text={`The amount of time purchasers have to purchase pool tokens`} />
					</>
				),
				subText:
					Number(
						ethers.utils
							.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
							.toString()
					) ===
						Number(
							ethers.utils
								.formatUnits(pool?.contributions.toString() ?? '-1', purchaseTokenDecimals ?? 0)
								.toString()
						) &&
					Number(
						ethers.utils
							.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
							.toString()
					) !== 0 ? (
						<div>Cap Reached</div>
					) : (
						<>
							<div>{formatShortDateWithTime(pool?.purchaseExpiry ?? 0)}</div>
							<div>{!isAfter(new Date(pool?.purchaseExpiry ?? 0), new Date()) && 'Ended'}</div>
						</>
					),
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
						<div>
							{formatShortDateWithTime((pool?.purchaseExpiry ?? 0) + (pool?.duration ?? 0))}
						</div>
						<div>
							{!isAfter(
								new Date((pool?.purchaseExpiry ?? 0) + (pool?.duration ?? 0)),
								new Date()
							) && 'Ended'}
						</div>
					</>
				),
			},
			{
				header: (
					<>
						<>{`Sponsor`}</>
						<QuestionMark
							text={`The sponsor will seek a deal on behalf of purchasers entering this pool`}
						/>
					</>
				),
				subText: (
					<FlexDivStart>
						<Ens address={pool?.sponsor ?? ''} />
						{pool?.sponsor && <CopyToClipboard text={pool?.sponsor} />}
					</FlexDivStart>
				),
			},
			{
				header: (
					<>
						<>{`Sponsor Fee`}</>
						<QuestionMark
							text={`The fee paid to the sponsor for each deal token redeemed, paid in deal tokens`}
						/>
					</>
				),
				subText: `${
					pool?.sponsorFee.toString() != null
						? Number(ethers.utils.formatEther(pool?.sponsorFee.toString()))
						: 0
				}%`,
			},
		],
		[
			pool,
			userPoolBalance,
			userPurchaseBalance,
			purchaseTokenSymbol,
			purchaseTokenDecimals,
			poolBalances?.totalAmountWithdrawn,
			poolBalances?.totalSupply,
		]
	);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !pool?.id || !purchaseTokenDecimals || !poolContract) return;
		try {
			const amount = isMaxValue
				? maxValueBN.toBN()
				: ethers.utils.parseUnits(
						(isEmptyInput ? 0 : inputValue).toString(),
						purchaseTokenDecimals
				  );

			const tx = await poolContract.purchasePoolTokens(amount, {
				gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
				gasPrice: gasPrice.toBN(),
			});

			setTxState(TransactionStatus.WAITING);

			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTimeout(() => {
							setInputValue('');
							poolBalancesQuery.refetch();
						}, 5 * 1000);
						setTxState(TransactionStatus.SUCCESS);
					},
				});
			}
		} catch (e) {
			console.log(e);
			setTxState(TransactionStatus.FAILED);
		}
	}, [
		walletAddress,
		signer,
		monitorTransaction,
		pool?.id,
		purchaseTokenDecimals,
		gasLimitEstimate,
		gasPrice,
		poolBalancesQuery,
		poolContract,
		setTxState,
		isEmptyInput,
		inputValue,
		isMaxValue,
		maxValueBN,
	]);

	const handleApprove = useCallback(async () => {
		if (!walletAddress || !signer || !pool?.id || !pool?.purchaseToken || !tokenContract) return;
		try {
			const tx = await tokenContract.approve(pool.id, ethers.constants.MaxUint256, {
				gasLimit: gasLimitEstimate?.toBN(),
				gasPrice: gasPrice.toBN(),
			});
			setTxState(TransactionStatus.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxState(TransactionStatus.SUCCESS);
						setTimeout(() => {
							poolBalancesQuery.refetch();
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
			setTxState(TransactionStatus.FAILED);
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
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={gridItems} />
			<PurchasePoolBox
				poolId={pool?.id}
				txType={txType}
				inputValue={inputValue}
				maxValue={maxValue}
				setInputValue={setInputValue}
				setIsMaxValue={setIsMaxValue}
				onSubmit={handleSubmit}
				onApprove={handleApprove}
				purchaseTokenAllowance={purchaseTokenAllowance}
				gasLimitEstimate={gasLimitEstimate}
				userPurchaseBalance={userPurchaseBalance}
				isPurchaseExpired={isPurchaseExpired}
				purchaseTokenSymbol={purchaseTokenSymbol}
				privatePoolDetails={{ isPrivatePool, privatePoolAmount }}
			/>
		</FlexDiv>
	);
};

export default PurchasePool;

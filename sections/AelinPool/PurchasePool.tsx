//@ts-nocheck
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
import QuestionMark from 'components/QuestionMark';

import { erc20Abi } from 'contracts/erc20';

import { TransactionStatus } from 'constants/transactions';

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

	const { gasPrice, setGasPrice, txState, setTxState, txType, setTxType } =
		TransactionData.useContainer();
	const [, setIsMaxValue] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState(0);

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
		return purchaseCap > 0
			? Math.min(Number(userPurchaseBalance), Math.max(purchaseCap - contributions, 0))
			: Number(userPurchaseBalance);
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
								ethers.utils.parseUnits((inputValue ?? 0).toString(), purchaseTokenDecimals)
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
		inputValue,
	]);

	const poolGridItems = useMemo(
		() => [
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
				subText: userPurchaseBalance,
			},
			{
				header: (
					<>
						<>{`Pool Cap`}</>
						<QuestionMark text={`Maximum number of pool tokens`} />
					</>
				),
				subText: Number(
					ethers.utils
						.formatUnits(pool?.purchaseTokenCap.toString() ?? '0', purchaseTokenDecimals ?? 0)
						.toString()
				),
			},
			{
				header: (
					<>
						<>{`Purchase Currency`}</>
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
						<>{`My pool balance`}</>
						<QuestionMark text={`The number of purchase tokens you have deposited`} />
					</>
				),
				subText: userPoolBalance,
			},
			{
				header: (
					<>
						<>{`Amount Funded`}</>
						<QuestionMark text={`The total amount of tokens all purchasers have deposited`} />
					</>
				),
				subText: ethers.utils
					.formatUnits(pool?.contributions.toString() ?? '0', purchaseTokenDecimals ?? 0)
					.toString(),
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
			{
				header: (
					<>
						<>{`Purchase Window`}</>
						<QuestionMark text={`The amount of time purchasers have to purchase pool tokens`} />
					</>
				),
				subText: <>{formatShortDateWithTime(pool?.purchaseExpiry ?? 0)}</>,
			},
			{
				header: (
					<>
						<>{`Pool Duration`}</>
						<QuestionMark
							text={`The amount of time a sponsor has to find a deal before purchasers can withdraw their funds`}
						/>
					</>
				),
				subText: (
					<>{formatShortDateWithTime((pool?.purchaseExpiry ?? 0) + (pool?.duration ?? 0))}</>
				),
			},
		],
		[pool, userPoolBalance, userPurchaseBalance, purchaseTokenSymbol, purchaseTokenDecimals]
	);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !pool?.id || !purchaseTokenDecimals || !poolContract) return;
		try {
			const tx = await poolContract.purchasePoolTokens(
				ethers.utils.parseUnits((inputValue ?? 0).toString(), purchaseTokenDecimals),
				{
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				}
			);
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
		inputValue,
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
		<SectionDetails
			privatePoolDetails={{ isPrivatePool, privatePoolAmount }}
			isPurchaseExpired={isPurchaseExpired}
			actionBoxType={ActionBoxType.FundPool}
			gridItems={poolGridItems}
			input={{
				placeholder: '0',
				label: `Balance ${userPurchaseBalance ?? ''} ${purchaseTokenSymbol ?? ''}`,
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
			txType={txType}
			setTxType={setTxType}
			setIsMaxValue={setIsMaxValue}
			inputValue={inputValue}
			setInputValue={setInputValue}
		/>
	);
};

export default PurchasePool;

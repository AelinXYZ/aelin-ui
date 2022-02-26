import { ethers } from 'ethers';
import styled from 'styled-components';
import { wei } from '@synthetixio/wei';
import { FC, useEffect, useState, useCallback, useMemo } from 'react';

import { erc20Abi } from 'contracts/erc20';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';

import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import TokenDisplay from 'components/TokenDisplay';

import { formatNumber } from 'utils/numbers';
import { getGasEstimateWithBuffer } from 'utils/network';

import { GasLimitEstimate } from 'constants/networks';
import { DEFAULT_DECIMALS, DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';
import { TransactionStatus } from 'constants/transactions';

import UnredeemedTokensBox from '../UnredeemedTokensBox';
import useInterval from 'hooks/useInterval';

interface UnredeemedTokensSectionProps {
	token: string;
	dealAddress: string;
	holder: string;
}

const UnredeemedTokensSection: FC<UnredeemedTokensSectionProps> = ({
	token,
	dealAddress,
	holder,
}) => {
	const { provider, walletAddress, signer } = Connector.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { setTxState, txState, gasPrice } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const [underlyingSymbol, setUnderlyingSymbol] = useState<string>('');
	const [totalAmount, setTotalAmount] = useState<number>(0);
	const [underlyingDecimals, setUnderlyingDecimals] = useState<number>(DEFAULT_DECIMALS);

	const getSymbolAndAmount = useCallback(async () => {
		if (provider && walletAddress === holder && dealAddress && token) {
			const underlyingTokenContract = new ethers.Contract(token, erc20Abi, provider);
			const dealContract = new ethers.Contract(dealAddress, dealAbi, provider);
			const [
				unformattedTotalSupply,
				unformattedUnderlyingPerDealExchangeRate,
				underlyingDecimals,
				underlyingSymbol,
				unformattedUnderlyingBalance,
			] = await Promise.all([
				dealContract.totalSupply(),
				dealContract.underlyingPerDealExchangeRate(),
				underlyingTokenContract.decimals(),
				underlyingTokenContract.symbol(),
				underlyingTokenContract.balanceOf(dealAddress),
			]);
			const totalSupply = ethers.utils.formatEther(unformattedTotalSupply);
			const underlyingPerDealExchangeRate = ethers.utils.formatEther(
				unformattedUnderlyingPerDealExchangeRate
			);
			const underlyingBalance = ethers.utils.formatUnits(
				unformattedUnderlyingBalance,
				underlyingDecimals
			);
			const formattedAmount =
				Number(underlyingBalance) - Number(totalSupply) * Number(underlyingPerDealExchangeRate);

			setTotalAmount(formattedAmount);
			setUnderlyingSymbol(underlyingSymbol);
			setUnderlyingDecimals(underlyingDecimals);
		}
	}, [dealAddress, holder, provider, token, walletAddress]);

	useEffect(() => {
		getSymbolAndAmount();
	}, [getSymbolAndAmount]);

	useInterval(() => {
		getSymbolAndAmount();
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || walletAddress !== holder || !signer || !dealAddress) return;

		const contract = new ethers.Contract(dealAddress, dealAbi, signer);
		try {
			const tx = await contract.withdrawExpiry({
				gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
				gasPrice: gasPrice?.toBN(),
			});
			if (tx) {
				setTxState(TransactionStatus.WAITING);
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => setTxState(TransactionStatus.SUCCESS),
				});
			}
		} catch (e) {
			setTxState(TransactionStatus.FAILED);
		}
	}, [
		walletAddress,
		signer,
		monitorTransaction,
		dealAddress,
		setTxState,
		gasLimitEstimate,
		gasPrice,
		holder,
	]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!signer || !dealAddress) return;
			try {
				const contract = new ethers.Contract(dealAddress, dealAbi, signer);
				setGasLimitEstimate(wei(await contract.estimateGas.withdrawExpiry(), 0));
			} catch (e) {
				console.log('gas estimate error', e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [dealAddress, setGasLimitEstimate, signer]);

	const gridItems = useMemo(
		() => [
			{
				header: 'Token to withdraw',
				subText: (
					<TokenDisplay
						address={token}
						displayAddress={true}
						symbol={underlyingSymbol ?? undefined}
					/>
				),
			},
			{
				header: 'Amount to withdraw',
				subText: <>{formatNumber(totalAmount ?? 0, underlyingDecimals)}</>,
			},
			{
				header: '',
				subText: <></>,
			},
		],
		[token, underlyingSymbol, totalAmount, underlyingDecimals]
	);

	const isButtonDisabled = Number(totalAmount ?? 0) === 0 || txState === TransactionStatus.WAITING;

	return (
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={gridItems} />
			<UnredeemedTokensBox
				totalAmount={totalAmount}
				underlyingSymbol={underlyingSymbol}
				underlyingDecimals={underlyingDecimals}
				handleSubmit={handleSubmit}
				isButtonDisabled={isButtonDisabled}
				gasLimitEstimate={gasLimitEstimate}
			/>
		</FlexDiv>
	);
};

export default UnredeemedTokensSection;

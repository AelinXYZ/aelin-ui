import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';

import { erc20Abi } from 'contracts/erc20';
import Connector from 'containers/Connector';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';
import SectionDetails from 'sections/shared/SectionDetails';
import { ActionBoxType } from 'components/ActionBox';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import { Transaction } from 'constants/transactions';

interface FundDealProps {
	token: string;
	dealAddress: string;
	amount: any;
}

const FundDeal: FC<FundDealProps> = ({ token, amount, dealAddress }) => {
	const { provider, walletAddress, signer } = Connector.useContainer();
	const { txState, setTxState } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const [allowance, setAllowance] = useState<number | null>(null);
	const [decimals, setDecimals] = useState<number | null>(null);
	const [balance, setBalance] = useState<number | null>(null);
	const [symbol, setSymbol] = useState<string | null>(null);

	useEffect(() => {
		async function getDecimals() {
			if (provider != null && walletAddress != null && dealAddress != null) {
				const contract = new ethers.Contract(token, erc20Abi, provider);
				const underlyingDecimals = await contract.decimals();
				const underlyingSymbol = await contract.symbol();
				const underlyingAllowance = await contract.allowance(walletAddress, dealAddress);
				const underlyingBalance = await contract.balanceOf(walletAddress);
				const formattedUnderlyingBalance = ethers.utils.formatUnits(
					underlyingBalance,
					underlyingDecimals
				);
				const formattedUnderlyingAllowance = ethers.utils.formatUnits(
					underlyingAllowance,
					underlyingDecimals
				);
				setDecimals(underlyingDecimals);
				setBalance(Number(formattedUnderlyingBalance));
				setAllowance(Number(formattedUnderlyingAllowance));
				setSymbol(underlyingSymbol);
			}
		}
		getDecimals();
	}, [provider, walletAddress, token, dealAddress]);

	const depositAmount = useMemo(
		() => ethers.utils.parseUnits(amount ?? 0, decimals ?? 0),
		[amount, decimals]
	);

	const handleSubmit = useCallback(
		async (value: number) => {
			if (!walletAddress || !signer || !dealAddress || !decimals) return;
			const contract = new ethers.Contract(dealAddress, dealAbi, signer);
			try {
				const tx = await contract.depositUnderlying(
					ethers.utils.parseUnits(value.toString(), decimals),
					// TODO update gasPrice and gasLimit
					{
						gasLimit: 1000000,
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
		[walletAddress, signer, monitorTransaction, dealAddress, decimals, setTxState]
	);

	const handleApprove = useCallback(async () => {
		if (!walletAddress || !signer || !dealAddress || !token) return;
		const contract = new ethers.Contract(token, erc20Abi, signer);
		try {
			const tx = await contract.approve(
				dealAddress,
				depositAmount,
				// TODO update gasPrice and gasLimit
				{
					gasLimit: 1000000,
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
	}, [dealAddress, token, monitorTransaction, setTxState, walletAddress, signer, depositAmount]);

	return (
		<SectionDetails
			actionBoxType={ActionBoxType.FundDeal}
			gridItems={[
				{
					header: 'Fund this deal',
					subText: `A sponsor has requested that you deposit ${depositAmount.toString()} of ${symbol}. Please submit your deposit here to start the deal`,
				},
			]}
			input={{
				placeholder: '0',
				label: `Balance ${balance} ${symbol}`,
				value: '0',
				maxValue: balance,
				symbol: symbol,
			}}
			allowance={allowance}
			onApprove={handleApprove}
			onSubmit={handleSubmit}
			txState={txState}
			setTxState={setTxState}
		/>
	);
};

export default FundDeal;

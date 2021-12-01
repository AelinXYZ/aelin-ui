import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';

import { erc20Abi } from 'contracts/erc20';
import Connector from 'containers/Connector';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import { Transaction } from 'constants/transactions';
import TokenDisplay from 'components/TokenDisplay';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';

interface FundDealProps {
	token: string;
	dealAddress: string;
	amount: any;
	purchaseTokenTotalForDeal: any;
	purchaseToken: string;
}

const FundDeal: FC<FundDealProps> = ({
	token,
	amount,
	dealAddress,
	purchaseToken,
	purchaseTokenTotalForDeal,
}) => {
	console.log('FundDeal issue');
	const { provider, walletAddress, signer } = Connector.useContainer();
	const { txState, setTxState } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const [allowance, setAllowance] = useState<number | null>(null);
	const [decimals, setDecimals] = useState<number | null>(null);
	const [balance, setBalance] = useState<number | null>(null);
	const [symbol, setSymbol] = useState<string | null>(null);
	const [purchaseTokenSymbol, setPurchaseTokenSymbol] = useState<string | null>(null);
	const [purchaseTokenDecimals, setPurchaseTokenDecimals] = useState<string | null>(null);

	useEffect(() => {
		async function getDecimals() {
			if (
				provider != null &&
				walletAddress != null &&
				dealAddress != null &&
				purchaseToken != null
			) {
				const purchaseContract = new ethers.Contract(purchaseToken, erc20Abi, provider);
				const purchaseSymbol = await purchaseContract.symbol();
				const purchaseDecimals = await purchaseContract.decimals();
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
				setPurchaseTokenSymbol(purchaseSymbol);
				setPurchaseTokenDecimals(purchaseDecimals);
			}
		}
		getDecimals();
	}, [provider, walletAddress, token, dealAddress, purchaseToken]);

	const depositAmount = useMemo(
		() => ethers.utils.parseUnits(String(amount ?? 0), decimals ?? 0).toString(),
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

	const gridItems = useMemo(
		() => [
			{
				header: 'Token to deposit',
				subText: <TokenDisplay address={token} displayAddress={true} symbol={symbol} />,
			},
			{
				header: 'Amount to deposit',
				subText: ethers.utils.formatUnits(depositAmount, decimals),
			},
			{
				header: 'Exchange rate',
				subText: Number(amount) / purchaseTokenTotalForDeal.toNumber(),
			},
			{
				header: 'Purchase token',
				subText: (
					<TokenDisplay
						address={purchaseToken}
						displayAddress={true}
						symbol={purchaseTokenSymbol}
					/>
				),
			},
			{
				header: 'Purchase token total',
				subText: ethers.utils.formatUnits(
					purchaseTokenTotalForDeal.toString(),
					purchaseTokenDecimals
				),
			},
		],
		[
			depositAmount,
			symbol,
			token,
			purchaseToken,
			purchaseTokenSymbol,
			purchaseTokenTotalForDeal,
			amount,
			decimals,
			purchaseTokenDecimals,
		]
	);

	return (
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={gridItems} />
			<Container>Button to submit here</Container>
		</FlexDiv>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	max-height: 400px;
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;
export default FundDeal;

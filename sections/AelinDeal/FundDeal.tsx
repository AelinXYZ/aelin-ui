import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';

import Spinner from 'assets/svg/loader.svg';
import { erc20Abi } from 'contracts/erc20';
import Connector from 'containers/Connector';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import { Transaction } from 'constants/transactions';
import TokenDisplay from 'components/TokenDisplay';
import Grid from 'components/Grid';
import { FlexDiv, StyledSpinner } from 'components/common';
import Button from 'components/Button';
import BaseModal from 'components/BaseModal';
import { formatShortDateWithTime } from 'utils/time';

interface FundDealProps {
	token: string;
	dealAddress: string;
	amount: any;
	purchaseTokenTotalForDeal: any;
	purchaseToken: string;
	holder: string;
	holderFundingExpiration: number;
}

const FundDeal: FC<FundDealProps> = ({
	token,
	amount,
	dealAddress,
	purchaseToken,
	purchaseTokenTotalForDeal,
	holder,
	holderFundingExpiration,
}) => {
	const { provider, walletAddress, signer } = Connector.useContainer();
	const { txState, setTxState } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const [showTxModal, setShowTxModal] = useState(false);
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
				purchaseToken != null &&
				token != null
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

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !dealAddress || !decimals || !amount) return;
		const contract = new ethers.Contract(dealAddress, dealAbi, signer);
		try {
			const tx = await contract.depositUnderlying(
				amount.toString(),
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
	}, [walletAddress, signer, monitorTransaction, dealAddress, decimals, setTxState, amount]);

	const handleApprove = useCallback(async () => {
		if (!walletAddress || !signer || !dealAddress || !token) return;
		const contract = new ethers.Contract(token, erc20Abi, signer);
		try {
			const tx = await contract.approve(
				dealAddress,
				amount.toString(),
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
	}, [dealAddress, token, monitorTransaction, setTxState, walletAddress, signer, amount]);

	const visibleAmount = useMemo(
		() => ethers.utils.formatUnits((amount ?? 0).toString(), decimals ?? 0),
		[amount, decimals]
	);

	const gridItems = useMemo(
		() => [
			{
				header: 'Token to deposit',
				subText: <TokenDisplay address={token} displayAddress={true} symbol={symbol} />,
			},
			{
				header: 'Amount to deposit',
				subText: visibleAmount,
			},
			{
				header: 'Exchange rate',
				subText:
					Number(amount?.toString() ?? '0') / Number((purchaseTokenTotalForDeal ?? 0).toString()),
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
					(purchaseTokenTotalForDeal ?? 0).toString(),
					purchaseTokenDecimals
				),
			},
			{
				header: 'Funding deadline',
				subText:
					holderFundingExpiration == null ? null : (
						<>{formatShortDateWithTime(holderFundingExpiration)}</>
					),
			},
		],
		[
			visibleAmount,
			holderFundingExpiration,
			symbol,
			token,
			purchaseToken,
			purchaseTokenSymbol,
			purchaseTokenTotalForDeal,
			amount,
			purchaseTokenDecimals,
		]
	);

	const isAllowance = useMemo(
		() => Number(allowance ?? 0) < Number((visibleAmount ?? 0).toString()),
		[visibleAmount, allowance]
	);

	const isEnough = useMemo(
		() => Number((balance ?? -1).toString()) >= Number(visibleAmount.toString()),
		[balance, visibleAmount]
	);

	return (
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={gridItems} />
			<Container>
				<Header>
					{walletAddress != holder
						? 'Only the holder funds the deal'
						: !isEnough
						? `Holder balance is only ${balance} but ${visibleAmount} is required to finalize the deal`
						: isAllowance
						? 'Approval is Required First'
						: 'Finalize Deal'}
				</Header>
				<StyledButton disabled={walletAddress != holder} onClick={() => setShowTxModal(true)}>
					{isAllowance
						? `Approve ${visibleAmount} ${symbol}`
						: `Deposit ${visibleAmount} ${symbol}`}
				</StyledButton>
			</Container>
			<BaseModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				onClose={() => setTxState(Transaction.PRESUBMIT)}
			>
				{/* TODO merge this with the new tx components when we refactor the action box */}
				{txState === Transaction.SUCCESS ? (
					<InnerContainer>
						<div>Your transaction has been submitted successfully</div>
					</InnerContainer>
				) : null}
				{txState === Transaction.WAITING ? <StyledSpinner src={Spinner} /> : null}
				{isAllowance && txState === Transaction.PRESUBMIT ? (
					<InnerContainer>
						<div>{`Please approve ${visibleAmount} ${symbol} for usage by the deal contract`}</div>
						<SubmitButton
							variant={'text'}
							onClick={(e) => {
								setTxState(Transaction.WAITING);
								handleApprove();
							}}
						>
							Confirm Approval
						</SubmitButton>
					</InnerContainer>
				) : null}
				{!isAllowance && txState === Transaction.PRESUBMIT ? (
					<InnerContainer>
						<div>{`You are going to finalize the depositing ${visibleAmount} of ${symbol}`}</div>
						<SubmitButton
							variant={'text'}
							onClick={(e) => {
								setTxState(Transaction.WAITING);
								handleSubmit();
							}}
						>
							Confirm Purchase
						</SubmitButton>
					</InnerContainer>
				) : null}
			</BaseModal>
		</FlexDiv>
	);
};

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 150px;
	margin-top: 20px;
`;

const InnerContainer = styled.div`
	height: 350px;
	width: 100%;
	text-align: center;
`;

const StyledButton = styled(Button)`
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 56px;
	background-color: ${(props) => props.theme.colors.forestGreen};
`;

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	max-height: 400px;
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const Header = styled.div`
	color: ${(props) => props.theme.colors.forestGreen};
	font-size: 14px;
	margin: 20px 0 50px 0;
	padding-left: 20px;
`;

export default FundDeal;

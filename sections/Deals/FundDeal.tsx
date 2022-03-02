import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { wei } from '@synthetixio/wei';

import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import { erc20Abi } from 'contracts/erc20';
import Connector from 'containers/Connector';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import { TransactionStatus } from 'constants/transactions';
import TokenDisplay from 'components/TokenDisplay';
import Grid from 'components/Grid';
import { FlexDiv } from 'components/common';
import Button from 'components/Button';
import { formatShortDateWithTime } from 'utils/time';
import { formatNumber } from 'utils/numbers';
import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';
import { DEFAULT_DECIMALS, EXCHANGE_DECIMALS } from 'constants/defaults';

import { Container, ContentContainer } from 'sections/shared/common';

interface FundDealProps {
	token: string;
	dealAddress: string;
	amount: BigInt;
	purchaseTokenTotalForDeal: BigInt;
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
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { setTxState, txState, setGasPrice, gasPrice } = TransactionData.useContainer();
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
			const tx = await contract.depositUnderlying(amount.toString(), {
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
			console.log('error submitting tx e', e);
			setTxState(TransactionStatus.FAILED);
		}
	}, [
		walletAddress,
		signer,
		monitorTransaction,
		dealAddress,
		decimals,
		setTxState,
		amount,
		gasLimitEstimate,
		gasPrice,
	]);

	const amountToFund = useMemo(
		() => ethers.utils.formatUnits((amount ?? 0).toString(), decimals ?? 0),
		[amount, decimals]
	);

	const handleApprove = useCallback(async () => {
		if (!walletAddress || !signer || !dealAddress || !token) return;
		const contract = new ethers.Contract(token, erc20Abi, signer);
		try {
			const tx = await contract.approve(dealAddress, amount.toString(), {
				gasLimit: gasLimitEstimate?.toBN(),
				gasPrice: gasPrice?.toBN(),
			});
			if (tx) {
				setTxState(TransactionStatus.WAITING);
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxState(TransactionStatus.SUCCESS);
						setTimeout(() => {
							setAllowance(Number(amountToFund.toString()));
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(' error submitting approve tx e', e);
			setTxState(TransactionStatus.FAILED);
		}
	}, [
		dealAddress,
		token,
		monitorTransaction,
		setTxState,
		walletAddress,
		signer,
		amount,
		gasLimitEstimate,
		gasPrice,
		amountToFund,
	]);

	const hasAllowance = useMemo(
		() => Number(allowance ?? 0) >= Number((amountToFund ?? 0).toString()),

		[amountToFund, allowance]
	);

	const areTokenSymbolsAvailable = [symbol, purchaseTokenSymbol].every(
		(val) => val !== null && val !== ''
	);

	const isEnough = useMemo(
		() => Number((balance ?? -1).toString()) >= Number(amountToFund.toString()),
		[balance, amountToFund]
	);

	const isHolder = walletAddress === holder;

	const isApproveButtonDisabled = !isHolder || txState === TransactionStatus.WAITING;

	const isFundButtomDisabled = !isHolder || !isEnough || txState === TransactionStatus.WAITING;

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!token || !signer || !dealAddress) return;
			try {
				if (!hasAllowance) {
					const contract = new ethers.Contract(token, erc20Abi, signer);
					setGasLimitEstimate(
						wei(await contract.estimateGas.approve(dealAddress, amount.toString()), 0)
					);
				} else {
					if (!purchaseTokenDecimals) return;
					const contract = new ethers.Contract(dealAddress, dealAbi, signer);

					setGasLimitEstimate(
						wei(await contract.estimateGas.depositUnderlying(amount.toString()), 0)
					);
				}
			} catch (e) {
				console.log('gas estimate error', e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [
		hasAllowance,
		dealAddress,
		setGasLimitEstimate,
		purchaseTokenDecimals,
		amount,
		token,
		signer,
	]);

	const gridItems = useMemo(
		() => [
			{
				header: 'Token to deposit',
				subText: (
					<TokenDisplay address={token} displayAddress={true} symbol={symbol ?? undefined} />
				),
			},
			{
				header: 'Amount to deposit',
				subText: <>{formatNumber(amountToFund, DEFAULT_DECIMALS)}</>,
			},
			{
				header: 'Exchange rates',
				subText: (
					<div>
						<ExchangeRate>
							{formatNumber(
								Number(ethers.utils.formatUnits((amount ?? 0).toString(), decimals ?? 18)) /
									Number(
										ethers.utils.formatUnits(
											(purchaseTokenTotalForDeal ?? 0).toString(),
											purchaseTokenDecimals ?? 18
										)
									),
								EXCHANGE_DECIMALS
							)}{' '}
							{areTokenSymbolsAvailable
								? `${symbol} per ${purchaseTokenSymbol} `
								: `Underlying per Purchase`}
						</ExchangeRate>
						<ExchangeRate>
							{formatNumber(
								Number(
									ethers.utils.formatUnits(
										(purchaseTokenTotalForDeal ?? 0).toString(),
										purchaseTokenDecimals ?? 18
									)
								) / Number(ethers.utils.formatUnits((amount ?? 0).toString(), decimals ?? 18)),
								EXCHANGE_DECIMALS
							)}{' '}
							{areTokenSymbolsAvailable
								? `${purchaseTokenSymbol} per ${symbol}`
								: `Purchase per Underlying: `}
						</ExchangeRate>
					</div>
				),
			},
			{
				header: 'Investment token',
				subText: (
					<TokenDisplay
						address={purchaseToken}
						displayAddress={true}
						symbol={purchaseTokenSymbol ?? undefined}
					/>
				),
			},
			{
				header: 'Investment token amount',
				subText: formatNumber(
					ethers.utils.formatUnits(
						(purchaseTokenTotalForDeal ?? 0).toString(),
						purchaseTokenDecimals ?? 18
					),
					DEFAULT_DECIMALS
				),
			},
			{
				header: 'Funding deadline',
				subText: holderFundingExpiration && <>{formatShortDateWithTime(holderFundingExpiration)}</>,
			},
		],
		[
			token,
			symbol,
			amountToFund,
			areTokenSymbolsAvailable,
			purchaseTokenSymbol,
			amount,
			decimals,
			purchaseTokenTotalForDeal,
			purchaseTokenDecimals,
			purchaseToken,
			holderFundingExpiration,
		]
	);

	return (
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={gridItems} />
			<Container>
				<ContentContainer>
					<Title>Fund Deal</Title>

					{isHolder && !isEnough && (
						<p>{`Holder balance is only ${balance} but ${amountToFund} is required to fund the deal`}</p>
					)}

					{!isHolder && <p>Only the holder funds the deal</p>}

					{isHolder && isEnough && !hasAllowance && (
						<p>{`Before funding the deal, you need to approve the pool to transfer your ${symbol}`}</p>
					)}

					{isHolder && isEnough && hasAllowance && (
						<p>
							Deal amount:{' '}
							<Bold>{`${formatNumber(amountToFund, DEFAULT_DECIMALS)} ${symbol}`}</Bold>
						</p>
					)}

					{!hasAllowance && (
						<Button
							variant="primary"
							size="lg"
							isRounded
							fullWidth
							disabled={isApproveButtonDisabled}
							onClick={() => setShowTxModal(true)}
						>
							Approve
						</Button>
					)}

					{hasAllowance && (
						<Button
							variant="primary"
							size="lg"
							isRounded
							fullWidth
							disabled={isFundButtomDisabled}
							onClick={() => setShowTxModal(true)}
						>
							{`Fund ${formatNumber(amountToFund, DEFAULT_DECIMALS)} ${symbol}`}
						</Button>
					)}
				</ContentContainer>
			</Container>
			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={!hasAllowance ? handleApprove : handleSubmit}
			>
				{!hasAllowance
					? `Confirm Approval of ${formatNumber(amountToFund, DEFAULT_DECIMALS)} ${symbol}`
					: `Confirm Funding of ${formatNumber(amountToFund, DEFAULT_DECIMALS)} ${symbol}`}
			</ConfirmTransactionModal>
		</FlexDiv>
	);
};

const Title = styled.h3`
	color: ${(props) => props.theme.colors.primary};
	font-size: 1.2rem;
	font-weight: 400;
	margin-top: 0;
`;

const Bold = styled.span`
	color: ${(props) => props.theme.colors.textSmall};
	font-size: 1rem;
	font-weight: 600;
`;

const ExchangeRate = styled.div`
	margin-bottom: 10px;
`;

export default FundDeal;

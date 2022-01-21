//@ts-nocheck
import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { wei } from '@synthetixio/wei';

import { SectionWrapper, ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';
import SectionTitle from 'sections/shared/SectionTitle';
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
import { formatNumber } from 'utils/numbers';
import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';
import { DEFAULT_DECIMALS } from 'constants/defaults';

interface WithdrawExpiryProps {
	token: string;
	dealAddress: string;
	holder: string;
}

const WithdrawExpiry: FC<WithdrawExpiryProps> = ({ token, dealAddress, holder }) => {
	const { provider, walletAddress, signer } = Connector.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { setTxState, setGasPrice, gasPrice } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const [showTxModal, setShowTxModal] = useState(false);
	const [symbol, setSymbol] = useState<string | null>(null);
	const [amount, setAmount] = useState<number | null>(null);

	useEffect(() => {
		async function getSymbolAndAmount() {
			if (provider != null && walletAddress === holder && dealAddress != null && token != null) {
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
				setSymbol(underlyingSymbol);
				setAmount(formattedAmount);
			}
		}
		getSymbolAndAmount();
	}, [provider, walletAddress, token, dealAddress, holder]);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || walletAddress !== holder || !signer || !dealAddress) return;
		const contract = new ethers.Contract(dealAddress, dealAbi, signer);
		setShowTxModal(false);
		try {
			const tx = await contract.withdrawExpiry({
				gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
				gasPrice: gasPrice?.toBN(),
			});
			if (tx) {
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
				subText: <TokenDisplay address={token} displayAddress={true} symbol={symbol} />,
			},
			{
				header: 'Amount to withdraw',
				subText: formatNumber(amount ?? 0, DEFAULT_DECIMALS),
			},
		],
		[amount, symbol, token]
	);

	return Number(amount ?? 0) > 0 ? (
		<SectionWrapper>
			<ContentHeader>
				<ContentTitle>
					<SectionTitle address={dealAddress} title="Holder Withdraws Unredeemed Tokens" />
				</ContentTitle>
			</ContentHeader>
			<FlexDiv>
				<Grid hasInputFields={false} gridItems={gridItems} />
				<Container>
					<Header>
						{walletAddress != holder
							? 'Only the holder may withdraw'
							: 'Withdraw unredeemed tokens'}
					</Header>
					<StyledButton disabled={walletAddress != holder} onClick={() => setShowTxModal(true)}>
						{`Withdraw ${formatNumber(amount ?? 0, DEFAULT_DECIMALS)} ${symbol}`}
					</StyledButton>
				</Container>
				<ConfirmTransactionModal
					title="Confirm Transaction"
					setIsModalOpen={setShowTxModal}
					isModalOpen={showTxModal}
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
					onSubmit={handleSubmit}
				>
					{`Confirm Withdrawal of ${formatNumber(amount ?? 0, DEFAULT_DECIMALS)} ${symbol}`}
				</ConfirmTransactionModal>
			</FlexDiv>
		</SectionWrapper>
	) : null;
};

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
	font-size: 1.2rem;
	margin: 20px 0 50px 0;
	padding-left: 20px;
`;

const ExchangeRate = styled.div`
	margin-bottom: 10px;
`;

export default WithdrawExpiry;

import { useState, FC, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import Image from 'next/image';

import { StakeActionLabel } from '../constants';
import StakeBox from '../StakeBox';
import ClaimBox from '../ClaimBox';
import QuestionMark from 'components/QuestionMark';
import { FlexDiv, FlexDivColCentered } from 'components/common';
import { GasLimitEstimate } from 'constants/networks';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import Connector from 'containers/Connector';
import { TransactionStatus } from 'constants/transactions';
import useGetTokenBalance from 'queries/token/useGetTokenBalance';
import useGetStakingRewardsData from 'queries/stakingRewards/useGetStakingRewardsDataForAddress';
import { getGasEstimateWithBuffer } from 'utils/network';
import { formatNumber } from 'utils/numbers';
import Etherscan from 'containers/BlockExplorer';
import EtherscanLogo from 'assets/svg/etherscan-logo.svg';
import erc20ABI from 'contracts/erc20';
import stakingRewardsABI from 'contracts/stakingRewardsV2';

type StakeSectionProps = {
	header: string;
	tooltipInfo: string;
	token: string;
	stakingContractAddress: string;
	tokenContractAddress: string;
	apyTooltip: string;
	apyQuery: Function;
	isLP: boolean;
};

const StakeSection: FC<StakeSectionProps> = ({
	header,
	tooltipInfo,
	token,
	stakingContractAddress,
	tokenContractAddress,
	apyQuery,
	apyTooltip,
	isLP,
}) => {
	const [hasAllowance, setHasAllowance] = useState<boolean>(false);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [stakeAction, setStakeAction] = useState<StakeActionLabel>(StakeActionLabel.DEPOSIT);
	const [inputValue, setInputValue] = useState<number>(0);
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);

	const { txState, setTxState, gasPrice, setGasPrice } = TransactionData.useContainer();
	const { walletAddress, signer } = Connector.useContainer();
	const { blockExplorerInstance } = Etherscan.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const StakingContract = useMemo(() => {
		if (!stakingContractAddress || !signer) return null;
		return new ethers.Contract(stakingContractAddress, stakingRewardsABI, signer);
	}, [stakingContractAddress, signer]);

	const TokenContract = useMemo(() => {
		if (!tokenContractAddress || !signer) return null;
		return new ethers.Contract(tokenContractAddress, erc20ABI, signer);
	}, [tokenContractAddress, signer]);

	const poolAPYQuery = apyQuery
		? apyQuery({
				stakingRewardsContract: StakingContract ?? null,
				tokenContract: TokenContract ?? null,
		  })
		: null;
	const apy = poolAPYQuery?.data?.apy ?? null;
	const etherAmount = poolAPYQuery?.data?.eth ?? 0;
	const aelinAmount = poolAPYQuery?.data?.aelin ?? 0;

	const tokenBalanceQuery = useGetTokenBalance({ tokenContract: TokenContract });
	const tokenBalance = tokenBalanceQuery?.data ?? wei(0);

	const tokenStakedBalanceQuery = useGetStakingRewardsData({
		stakingRewardsContract: StakingContract,
	});
	const tokenStakedBalance = tokenStakedBalanceQuery?.data?.balance ?? wei(0);

	const totalBalance = useMemo(() => {
		if (stakeAction === StakeActionLabel.DEPOSIT) {
			return tokenBalance;
		} else return tokenStakedBalance;
	}, [stakeAction, tokenBalance, tokenStakedBalance]);

	const getAllowance = useCallback(async () => {
		if (!TokenContract || !StakingContract || !walletAddress) return;
		try {
			const allowance = await TokenContract.allowance(walletAddress, StakingContract.address);
			setHasAllowance(!!Number(ethers.utils.formatEther(allowance)));
		} catch (e) {
			console.log(e);
			setHasAllowance(false);
		}
	}, [TokenContract, StakingContract, walletAddress]);

	useEffect(() => {
		getAllowance();
	}, [getAllowance]);

	useEffect(() => {
		const getGasEstimate = async () => {
			if (!TokenContract || !StakingContract || !walletAddress) return;
			try {
				setGasLimitEstimate(null);
				if (!hasAllowance) {
					const gasLimit = await TokenContract.estimateGas.approve(
						StakingContract.address,
						ethers.constants.MaxUint256
					);
					setGasLimitEstimate(wei(gasLimit, 0));
				} else if (stakeAction === StakeActionLabel.DEPOSIT && !!inputValue) {
					const amount = isMaxValue
						? tokenBalance.toBN()
						: ethers.utils.parseEther(inputValue.toString());
					const gasLimit = await StakingContract.estimateGas.stake(amount);
					setGasLimitEstimate(wei(gasLimit, 0));
				} else if (stakeAction === StakeActionLabel.WITHDRAW && !!inputValue) {
					const amount = isMaxValue
						? tokenStakedBalance.toBN()
						: ethers.utils.parseEther(inputValue.toString());
					const gasLimit = await StakingContract.estimateGas.withdraw(amount);
					setGasLimitEstimate(wei(gasLimit, 0));
				}
			} catch (e) {
				console.log(e);
				setGasLimitEstimate(null);
			}
		};
		getGasEstimate();
	}, [
		hasAllowance,
		TokenContract,
		StakingContract,
		walletAddress,
		stakeAction,
		inputValue,
		isMaxValue,
		tokenBalance,
		tokenStakedBalance,
	]);

	const handleApprove = useCallback(async () => {
		if (!gasLimitEstimate || !TokenContract || !StakingContract) return;
		try {
			const tx = await TokenContract.approve(StakingContract.address, ethers.constants.MaxInt256, {
				gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
				gasPrice: gasPrice.toBN(),
			});
			setTxState(TransactionStatus.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxState(TransactionStatus.SUCCESS);
						setTimeout(() => {
							getAllowance();
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
		}
	}, [
		gasLimitEstimate,
		TokenContract,
		StakingContract,
		gasPrice,
		setTxState,
		monitorTransaction,
		getAllowance,
	]);

	const handleSubmit = useCallback(async () => {
		if (!inputValue || !StakingContract || !walletAddress || !gasLimitEstimate || !gasPrice) return;
		try {
			let tx;
			if (stakeAction === StakeActionLabel.DEPOSIT) {
				const amount = isMaxValue
					? tokenBalance.toBN()
					: ethers.utils.parseEther(inputValue.toString());
				tx = await StakingContract.stake(amount, {
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				});
			} else {
				const amount = isMaxValue
					? tokenStakedBalance.toBN()
					: ethers.utils.parseEther(inputValue.toString());
				tx = await StakingContract.withdraw(amount, {
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				});
			}
			setTxState(TransactionStatus.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxState(TransactionStatus.SUCCESS);
						setTimeout(() => {
							tokenBalanceQuery.refetch();
							tokenStakedBalanceQuery.refetch();
							setInputValue(0);
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
		}
	}, [
		stakeAction,
		StakingContract,
		walletAddress,
		gasLimitEstimate,
		gasPrice,
		inputValue,
		isMaxValue,
		tokenBalance,
		tokenStakedBalance,
		monitorTransaction,
		setTxState,
		tokenBalanceQuery,
		tokenStakedBalanceQuery,
	]);

	const handleSetAction = (action: StakeActionLabel) => {
		setStakeAction(action);
		setInputValue(0);
	};

	return (
		<>
			<HeaderSection>
				<HeaderRow>
					<Header>
						<EtherscanLink
							href={blockExplorerInstance?.addressLink(StakingContract?.address!)}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image width="20" height="20" src={EtherscanLogo} alt="etherscan logo" />
						</EtherscanLink>
						{header}
					</Header>
					<QuestionMark text={tooltipInfo} />
				</HeaderRow>
				<SubHeader>
					<FlexDiv>
						{apy === null ? 'APY: TBD' : `APY: ${formatNumber(apy?.toFixed(0) ?? 0, 0)}%`}
						<QuestionMark text={apyTooltip} />
					</FlexDiv>
				</SubHeader>
			</HeaderSection>
			<StakeBox
				onSubmit={handleSubmit}
				onApprove={handleApprove}
				isApproved={hasAllowance}
				balance={totalBalance}
				input={{
					placeholder: '0',
					label: `Balance ${totalBalance?.toNumber()} ${token}`,
					symbol: token,
				}}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				action={stakeAction}
				setAction={handleSetAction}
				txState={txState}
				inputValue={inputValue}
				setInputValue={setInputValue}
				setIsMaxValue={setIsMaxValue}
			/>
			<ClaimBox stakingContract={StakingContract} />
			<SubHeader>
				<FlexDiv>
					{isLP && etherAmount !== null ? `ETH in pool: ${formatNumber(etherAmount, 2)}` : null}
				</FlexDiv>
				<FlexDiv>
					{aelinAmount !== null
						? isLP
							? `AELIN in pool: ${formatNumber(aelinAmount, 2)}`
							: `AELIN staked: ${formatNumber(aelinAmount, 2)}`
						: null}
				</FlexDiv>
			</SubHeader>
		</>
	);
};

const EtherscanLink = styled.a`
	margin-right: 4px;
`;

const HeaderSection = styled(FlexDivColCentered)`
	margin: 0 0 20px 0;
`;

const HeaderRow = styled(FlexDiv)`
	align-items: center;
`;

const Header = styled.h3`
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 2rem;
	margin: 0;
	padding: 0;
`;

const SubHeader = styled.h4`
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 1.2rem;
	margin: 0;
	padding: 0;
`;

export default StakeSection;

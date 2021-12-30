import { useState, FC, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';

import Button from 'components/Button';
import { StakeActionLabel } from '../constants';
import StakeBox from '../StakeBox';
import QuestionMark from 'components/QuestionMark';
import { FlexDivCol, FlexDiv } from 'components/common';
import { GasLimitEstimate } from 'constants/networks';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import { StakingContracts } from 'containers/ContractsInterface/constants';
import Connector from 'containers/Connector';
import { TransactionStatus } from 'constants/transactions';
import useGetTokenBalance from 'queries/token/useGetTokenBalance';
import useGetStakingRewardsData from 'queries/stakingRewards/useGetStakingRewardsData';
import { getGasEstimateWithBuffer } from 'utils/network';
import { formatNumber } from 'utils/numbers';

type StakeSectionProps = {
	header: string;
	tooltipInfo: string;
	token: string;
	contracts: StakingContracts | null;
};

const StakeSection: FC<StakeSectionProps> = ({ header, tooltipInfo, token, contracts }) => {
	const [hasAllowance, setHasAllowance] = useState<boolean>(false);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [stakeAction, setStakeAction] = useState<StakeActionLabel>(StakeActionLabel.DEPOSIT);
	const [inputValue, setInputValue] = useState<number>(0);
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);

	const { txState, setTxState, gasPrice, setGasPrice } = TransactionData.useContainer();
	const { walletAddress } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const StakingContract = contracts?.StakingContract ?? null;
	const TokenContract = contracts?.TokenContract ?? null;

	const tokenBalanceQuery = useGetTokenBalance({ tokenContract: TokenContract });
	const tokenBalance = tokenBalanceQuery?.data ?? wei(0);

	const tokenStakedBalanceQuery = useGetStakingRewardsData({
		stakingRewardsContract: StakingContract,
	});
	const tokenStakedBalance = tokenStakedBalanceQuery?.data?.balance ?? wei(0);
	const earned = tokenStakedBalanceQuery?.data?.earned ?? wei(0);

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

	const handleClaim = useCallback(async () => {}, []);

	return (
		<>
			<HeaderSection>
				<Header>{header}</Header>
				<QuestionMark text={tooltipInfo} />
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
			<RewardsBox>
				<div>{`Rewards: ${
					earned.gt(wei(0)) ? formatNumber(earned.toString(), 6) : '0'
				} AELIN`}</div>
				<SubmitButton onClick={handleClaim} variant="text">
					Claim
				</SubmitButton>
			</RewardsBox>
		</>
	);
};

const HeaderSection = styled(FlexDiv)`
	align-items: center;
	margin: 0 0 20px 0;
`;

const Header = styled.h3`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 22px;
	margin: 0;
	padding: 0;
`;

const RewardsBox = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	text-align: center;
	margin-top: 20px;
	margin-bottom: 20px;
	padding: 20px;
	height: 100px;
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 120px;
	margin: 10px auto 0 auto;
	&:hover {
		&:not(:disabled) {
			color: ${(props) => props.theme.colors.white};
			box-shadow: 0px 0px 10px rgba(71, 120, 48, 0.8);
		}
	}
`;

export default StakeSection;

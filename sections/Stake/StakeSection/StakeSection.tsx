import { useState, FC, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';

import { GasLimitEstimate } from 'constants/networks';
import { TransactionStatus } from 'constants/transactions';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';

import useGetTokenBalance from 'queries/token/useGetTokenBalance';
import useGetStakingRewardsData from 'queries/stakingRewards/useGetStakingRewardsDataForAddress';

import { getGasEstimateWithBuffer } from 'utils/network';

import erc20ABI from 'contracts/erc20';
import stakingRewardsABI from 'contracts/stakingRewardsV2';

import { StakeActionLabel } from '../constants';
import StakeBox from '../StakeBox';
import ClaimBox from '../ClaimBox';

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
	const [allowanceValue, setAllowanceValue] = useState<number>(0);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [stakeAction, setStakeAction] = useState<StakeActionLabel>(StakeActionLabel.DEPOSIT);
	const [inputValue, setInputValue] = useState<number | string>('');
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);

	const { setTxState, gasPrice, setGasPrice } = TransactionData.useContainer();
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const StakingContract = useMemo(() => {
		if (!stakingContractAddress || !signer) {
			return null;
		}
		return new ethers.Contract(stakingContractAddress, stakingRewardsABI, signer);
	}, [stakingContractAddress, signer]);

	const TokenContract = useMemo(() => {
		if (!tokenContractAddress || !signer) {
			return null;
		}
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
		} else {
			return tokenStakedBalance;
		}
	}, [stakeAction, tokenBalance, tokenStakedBalance]);

	const getAllowance = useCallback(async () => {
		if (!TokenContract || !StakingContract || !walletAddress) {
			return;
		}
		try {
			const allowanceValue = await TokenContract.allowance(walletAddress, StakingContract.address);
			setAllowanceValue(Number(ethers.utils.formatEther(allowanceValue)));
		} catch (e) {
			console.log(e);
			setAllowanceValue(0);
		}
	}, [TokenContract, StakingContract, walletAddress]);

	useEffect(() => {
		getAllowance();
	}, [getAllowance]);

	useEffect(() => {
		const getGasEstimate = async () => {
			if (!TokenContract || !StakingContract || !walletAddress) {
				return;
			}
			try {
				setGasLimitEstimate(null);
				if (inputValue > allowanceValue) {
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
		allowanceValue,
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
		if (!gasLimitEstimate || !TokenContract || !StakingContract) {
			return;
		}
		try {
			const tx = await TokenContract.approve(StakingContract.address, ethers.constants.MaxInt256, {
				gasLimit: getGasEstimateWithBuffer(gasLimitEstimate, true)?.toBN(),
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
		if (!inputValue || !StakingContract || !walletAddress || !gasLimitEstimate || !gasPrice) {
			return;
		}
		try {
			let tx;
			if (stakeAction === StakeActionLabel.DEPOSIT) {
				const amount = isMaxValue
					? tokenBalance.toBN()
					: ethers.utils.parseEther(inputValue.toString());
				tx = await StakingContract.stake(amount, {
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate, true)?.toBN(),
					gasPrice: gasPrice.toBN(),
				});
			} else {
				const amount = isMaxValue
					? tokenStakedBalance.toBN()
					: ethers.utils.parseEther(inputValue.toString());
				tx = await StakingContract.withdraw(amount, {
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate, true)?.toBN(),
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
							getAllowance()
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
			<StakeBox
				header={header}
				tooltipInfo={tooltipInfo}
				apyTooltip={apyTooltip}
				apy={apy}
				stakingContract={StakingContract}
				onSubmit={handleSubmit}
				onApprove={handleApprove}
				isApproved={allowanceValue >= inputValue}
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
				inputValue={inputValue}
				setInputValue={setInputValue}
				setIsMaxValue={setIsMaxValue}
			/>
			<ClaimBox
				isLP={isLP}
				aelinAmount={aelinAmount}
				etherAmount={etherAmount}
				stakingContract={StakingContract}
			/>
		</>
	);
};

export default StakeSection;

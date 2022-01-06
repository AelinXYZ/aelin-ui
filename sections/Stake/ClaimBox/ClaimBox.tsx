import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Wei, { wei } from '@synthetixio/wei';
import { ethers } from 'ethers';

import { formatNumber } from 'utils/numbers';
import Button from 'components/Button';
import { GasLimitEstimate } from 'constants/networks';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import useGetStakingRewardsData from 'queries/stakingRewards/useGetStakingRewardsDataForAddress';
import { getGasEstimateWithBuffer } from 'utils/network';
import { TransactionStatus } from 'constants/transactions';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

type ClaimBoxProps = {
	stakingContract: ethers.Contract | null;
};

const ClaimBox: FC<ClaimBoxProps> = ({ stakingContract }) => {
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [showTxModal, setShowTxModal] = useState(false);

	const { walletAddress } = Connector.useContainer();
	const { txState, setTxState, gasPrice, setGasPrice } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const tokenStakedBalanceQuery = useGetStakingRewardsData({
		stakingRewardsContract: stakingContract,
	});
	const earned = tokenStakedBalanceQuery?.data?.earned ?? wei(0);

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState]);

	useEffect(() => {
		const getGasEstimate = async () => {
			if (!stakingContract || !walletAddress || !earned || !earned.gt(wei(0))) return;
			try {
				setGasLimitEstimate(null);
				const gasLimit = await stakingContract.estimateGas.getReward();
				setGasLimitEstimate(wei(gasLimit, 0));
			} catch (e) {
				console.log(e);
				setGasLimitEstimate(null);
			}
		};
		getGasEstimate();
	}, [stakingContract, walletAddress, earned]);

	const handleClaim = useCallback(async () => {
		if (!gasLimitEstimate || !stakingContract || !walletAddress || !gasPrice) return;
		try {
			const tx = await stakingContract.getReward({
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
							tokenStakedBalanceQuery.refetch();
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
		}
	}, [
		gasLimitEstimate,
		stakingContract,
		walletAddress,
		gasPrice,
		monitorTransaction,
		tokenStakedBalanceQuery,
		setTxState,
	]);

	const modalContent = useMemo(() => {
		return {
			onSubmit: handleClaim,
			heading: `Confirm claim of ${
				earned.gt(wei(0)) ? formatNumber(earned.toString(), 6) : '0'
			} AELIN`,
		};
	}, [earned, handleClaim]);

	return (
		<RewardsBox>
			<div>{`Rewards: ${earned.gt(wei(0)) ? formatNumber(earned.toString(), 6) : '0'} AELIN`}</div>
			<SubmitButton
				onClick={() => setShowTxModal(true)}
				variant="text"
				disabled={earned.eq(wei(0))}
			>
				Claim
			</SubmitButton>
			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={modalContent?.onSubmit}
			>
				{modalContent?.heading}
			</ConfirmTransactionModal>
		</RewardsBox>
	);
};

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

export default ClaimBox;

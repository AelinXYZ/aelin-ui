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
import { CardSubTitleText, CardTitleText } from 'components/Typography';

type ClaimBoxProps = {
	stakingContract: ethers.Contract | null;
	isLP: boolean;
	aelinAmount: number | null;
	etherAmount: number | null;
};

const ClaimBox: FC<ClaimBoxProps> = ({ stakingContract, isLP, aelinAmount, etherAmount }) => {
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [showTxModal, setShowTxModal] = useState(false);

	const { walletAddress } = Connector.useContainer();
	const { setTxState, gasPrice, setGasPrice } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const tokenStakedBalanceQuery = useGetStakingRewardsData({
		stakingRewardsContract: stakingContract,
	});

	const balance = tokenStakedBalanceQuery?.data?.balance ?? wei(0);
	const earned = tokenStakedBalanceQuery?.data?.earned ?? wei(0);

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
			<Header>Claim rewards</Header>

			{isLP && etherAmount !== null && (
				<SubHeader>{`$ETH in pool via G-UNI: ${formatNumber(etherAmount, 2)}`}</SubHeader>
			)}

			{isLP && aelinAmount !== null && (
				<SubHeader>{`$AELIN in pool via G-UNI: ${formatNumber(aelinAmount, 2)}`}</SubHeader>
			)}

			{isLP && (
				<SubHeader>{`My Stake: ${
					balance.gt(wei(0)) ? formatNumber(balance.toString(), 6) : '0'
				} G-UNI`}</SubHeader>
			)}

			{!isLP && (
				<SubHeader>
					{`Total AELIN Staked: ${aelinAmount !== null ? formatNumber(aelinAmount, 2) : 0}`} AELIN{' '}
				</SubHeader>
			)}

			{!isLP && (
				<SubHeader>{`My Stake: ${
					balance.gt(wei(0)) ? formatNumber(balance.toString(), 6) : '0'
				} AELIN`}</SubHeader>
			)}

			<SubHeader>{`My Rewards: ${
				earned.gt(wei(0)) ? formatNumber(earned.toString(), 6) : '0'
			} AELIN`}</SubHeader>

			<Button
				fullWidth
				isRounded
				variant="primary"
				onClick={() => setShowTxModal(true)}
				disabled={earned.eq(wei(0))}
			>
				Claim
			</Button>
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
	background-color: ${(props) => props.theme.colors.tablePrimary};
	width: 420px;
	margin-top: 1rem;
	padding: 30px 60px;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.tableBorders};
	position: relative;
`;

const Header = styled(CardTitleText)`
	color: ${(props) => props.theme.colors.heading};
	text-align: center;
	margin: 0;
	margin-bottom: 1rem;
	padding: 0;
`;

const SubHeader = styled(CardSubTitleText)`
	text-align: center;
	margin: 1rem 0;
	color: ${(props) => props.theme.colors.heading};
`;

export default ClaimBox;

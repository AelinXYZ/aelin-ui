import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import ContractsInterface from 'containers/ContractsInterface';
import TransactionNotifier from 'containers/TransactionNotifier';

import useGetTokenBalance from 'queries/token/useGetTokenBalance';

import Button from 'components/Button';
import { FlexDivColCentered } from 'components/common';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { GasLimitEstimate } from 'constants/networks';
import { TransactionStatus } from 'constants/transactions';

import { getGasEstimateWithBuffer } from 'utils/network';

const ConvertSection = () => {
	const [hasAllowance, setHasAllowance] = useState<boolean>(false);
	const [showConverterTxModal, setConverterTxModal] = useState<boolean>(false);
	const [gasvAelinConverterLimitEstimate, setvAelinConverterGasLimitEstimate] =
		useState<GasLimitEstimate>(null);

	const { contracts } = ContractsInterface.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { walletAddress, network } = Connector.useContainer();
	const { gasPrice, setGasPrice, setTxState } = TransactionData.useContainer();

	const vAelinTokenContract = contracts?.vAelinConverter?.VAelinTokenContract ?? null;
	const vAelinConverterContract = contracts?.vAelinConverter?.VAelinConverterContract ?? null;

	const tokenBalanceQuery = useGetTokenBalance({ tokenContract: vAelinTokenContract });

	const hasTokenBalance = !!(tokenBalanceQuery?.data ?? wei(0)).toNumber();

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!walletAddress || !vAelinConverterContract || !vAelinTokenContract) return;
			try {
				setvAelinConverterGasLimitEstimate(null);
				if (!hasAllowance) {
					const gasLimit = await vAelinTokenContract.estimateGas.approve(
						vAelinConverterContract.address,
						ethers.constants.MaxUint256
					);
					setvAelinConverterGasLimitEstimate(wei(gasLimit, 0));
				} else {
					const gasEstimate = await vAelinConverterContract.estimateGas.convertAll();
					setvAelinConverterGasLimitEstimate(wei(gasEstimate, 0));
				}
			} catch (e) {
				console.log(e);
				setvAelinConverterGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [walletAddress, network.id, vAelinConverterContract, vAelinTokenContract, hasAllowance]);

	const getAllowance = useCallback(async () => {
		if (!vAelinConverterContract || !vAelinTokenContract || !walletAddress) return;
		try {
			const allowance = await vAelinTokenContract.allowance(
				walletAddress,
				vAelinConverterContract.address
			);
			setHasAllowance(!!Number(ethers.utils.formatEther(allowance)));
		} catch (e) {
			console.log(e);
			setHasAllowance(false);
		}
	}, [vAelinTokenContract, vAelinConverterContract, walletAddress]);

	const handleConvertAll = useCallback(async () => {
		if (!vAelinConverterContract || !vAelinTokenContract || !walletAddress) return;
		try {
			const tx = await vAelinConverterContract.convertAll({
				gasLimit: getGasEstimateWithBuffer(gasvAelinConverterLimitEstimate)?.toBN(),
				gasPrice: gasPrice.toBN(),
			});

			setTxState(TransactionStatus.WAITING);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTxState(TransactionStatus.SUCCESS);
						setTimeout(() => {
							tokenBalanceQuery.refetch();
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
		}
	}, [
		gasPrice,
		gasvAelinConverterLimitEstimate,
		tokenBalanceQuery,
		monitorTransaction,
		setTxState,
		vAelinConverterContract,
		vAelinTokenContract,
		walletAddress,
	]);

	const handleApprove = useCallback(async () => {
		if (!gasvAelinConverterLimitEstimate || !vAelinTokenContract || !vAelinConverterContract)
			return;
		try {
			const tx = await vAelinTokenContract.approve(
				vAelinConverterContract.address,
				ethers.constants.MaxInt256,
				{
					gasLimit: getGasEstimateWithBuffer(gasvAelinConverterLimitEstimate)?.toBN(),
					gasPrice: gasPrice.toBN(),
				}
			);
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
		gasvAelinConverterLimitEstimate,
		vAelinTokenContract,
		vAelinConverterContract,
		gasPrice,
		setTxState,
		monitorTransaction,
		getAllowance,
	]);

	useEffect(() => {
		getAllowance();
	}, [getAllowance]);

	return (
		<>
			<Row>
				<Header>Convert your vAELIN</Header>

				{!hasTokenBalance && (
					<SubmitButton disabled variant="primary">
						Nothing to Convert
					</SubmitButton>
				)}
				{!hasAllowance && hasTokenBalance && (
					<SubmitButton onClick={() => setConverterTxModal(true)} variant="primary">
						Approve vAELIN
					</SubmitButton>
				)}
				{hasTokenBalance && (
					<SubmitButton
						disabled={!hasAllowance}
						onClick={() => setConverterTxModal(true)}
						variant="primary"
					>
						Convert vAELIN to AELIN
					</SubmitButton>
				)}

				<Note>
					There is a 2% conversion loss when going from vAELIN to AELIN. An additional 2% of vAELIN
					was distributed to account for this. It is due to the 2% protocol fee that was charged on
					the vAELIN pool
				</Note>
			</Row>
			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setConverterTxModal}
				isModalOpen={showConverterTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasvAelinConverterLimitEstimate}
				onSubmit={!hasAllowance ? handleApprove : handleConvertAll}
			>
				{!hasAllowance ? `Approval token` : `Conversion from vAELIN to AELIN`}
			</ConfirmTransactionModal>
		</>
	);
};

const Row = styled(FlexDivColCentered)`
	width: 500px;
	margin: 0 auto;
`;

const Note = styled.p`
	text-align: left;
	width: 500px;
	font-size: 1rem;
	padding: 20px;
	margin: 20px 0;
	border-radius: 8px;
	color: ${(props) => props.theme.colors.black};
`;

const SubmitButton = styled(Button)`
	margin: 10px 0;
	width: 220px;
`;

const Header = styled.h3`
	margin-top: 0;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 1.6rem;
`;

export default ConvertSection;

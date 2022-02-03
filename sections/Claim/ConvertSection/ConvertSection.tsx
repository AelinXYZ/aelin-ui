import Link from 'next/link';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import styled from 'styled-components';
import { useState, useEffect, useCallback, useMemo } from 'react';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';

import VAelinTokenContract from 'containers/ContractsInterface/contracts/vAelinToken';
import VAelinConverterContract from 'containers/ContractsInterface/contracts/VAelinConverter';

import Button from 'components/Button';
import { FlexDivColCentered } from 'components/common';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import ROUTES from 'constants/routes';
import { GasLimitEstimate } from 'constants/networks';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import { TransactionStatus } from 'constants/transactions';

import { getKeyValue } from 'utils/helpers';
import { getGasEstimateWithBuffer } from 'utils/network';

const ConvertSection = () => {
	const [hasAllowance, setHasAllowance] = useState<boolean>(false);
	const [hasVAelinBalance, setHasVAelinBalance] = useState<boolean>(false);
	const [showConverterTxModal, setConverterTxModal] = useState<boolean>(false);
	const [gasvAelinConverterLimitEstimate, setvAelinConverterGasLimitEstimate] =
		useState<GasLimitEstimate>(null);

	const { gasPrice, setGasPrice, setTxState } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { walletAddress, network, signer } = Connector.useContainer();

	const vAelinConverterContract = useMemo(() => {
		if (!signer || !network?.id) return null;

		const vAelinConverterContract = (getKeyValue(VAelinConverterContract) as any)(
			network?.id ?? DEFAULT_NETWORK_ID
		);

		if (!vAelinConverterContract) return null;

		return new ethers.Contract(
			vAelinConverterContract.address,
			vAelinConverterContract.abi,
			signer
		);
	}, [signer, network?.id]);

	const vAelinTokenContract = useMemo(() => {
		if (!signer || !network?.id) return null;

		const vAelinTokenContract = (getKeyValue(VAelinTokenContract) as any)(
			network?.id ?? DEFAULT_NETWORK_ID
		);

		if (!vAelinTokenContract) return null;

		return new ethers.Contract(vAelinTokenContract.address, vAelinTokenContract.abi, signer);
	}, [signer, network?.id]);

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

	const getVAelinBalance = useCallback(async () => {
		if (!vAelinTokenContract || !walletAddress) return;

		try {
			const tx = await vAelinTokenContract.balanceOf(walletAddress);
			setHasVAelinBalance(!!Number(ethers.utils.formatEther(tx)));
		} catch (e) {
			console.log(e);
			setHasVAelinBalance(false);
		}
	}, [vAelinTokenContract, walletAddress]);

	const handleConverAll = useCallback(async () => {
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
							getVAelinBalance();
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
		getVAelinBalance,
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

	useEffect(() => {
		getVAelinBalance();
	}, [getVAelinBalance]);

	return (
		<>
			<Row>
				<Header>Convert your vAELIN</Header>
				{!hasVAelinBalance && (
					<SubmitButton disabled variant="text">
						Nothing to Convert
					</SubmitButton>
				)}
				{!hasAllowance && hasVAelinBalance && (
					<SubmitButton onClick={() => setConverterTxModal(true)} variant="text">
						Approve vAELIN
					</SubmitButton>
				)}
				{hasVAelinBalance && (
					<SubmitButton
						disabled={!hasAllowance}
						onClick={() => setConverterTxModal(true)}
						variant="text"
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
			<Row>
				<Link href={ROUTES.Pools.PoolView('0x3074306c0cc9200602bfc64beea955928dac56dd')} passHref>
					<Anchor>Go to the vAELIN Pool</Anchor>
				</Link>
			</Row>
			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setConverterTxModal}
				isModalOpen={showConverterTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasvAelinConverterLimitEstimate}
				onSubmit={!hasAllowance ? handleApprove : handleConverAll}
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

const P = styled.p`
	text-align: left;
	width: 500px;
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	padding: 20px;
	font-size: 1.3rem;
	font-weight: bold;
`;

const Note = styled.p`
	text-align: left;
	width: 500px;
	font-size: 1rem;
	padding: 20px;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.forestGreen};
	background-color: ${(props) => props.theme.colors.white};
	color: ${(props) => props.theme.colors.forestGreen};
`;

const Header = styled.h3`
	margin: 40px 0 0 0;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 1.6rem;
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	margin: 10px auto 0 auto;
	padding: 0 8px;
	&:disabled {
		background-color: ${(props) => props.theme.colors.forestGreen};
		opacity: 0.5;
	}
	&:hover {
		&:not(:disabled) {
			color: ${(props) => props.theme.colors.white};
			box-shadow: 0px 0px 10px rgba(71, 120, 48, 0.8);
		}
	}
`;

const Anchor = styled.a`
	margin-top: 80px;
	text-decoration: underline;
	color: ${(props) => props.theme.colors.forestGreen};
`;

export default ConvertSection;

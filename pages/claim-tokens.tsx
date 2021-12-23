import Head from 'next/head';
import { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import useGetAirdropDataForAddress from 'queries/airdrop/useGetAirdropDataForAddress';
import useGetCanClaimForAddress from 'queries/airdrop/useGetCanClaimForAddress';
import { PageLayout } from 'sections/Layout';
import { FlexDivColCentered } from 'components/common';
import Button from 'components/Button';
import { wei } from '@synthetixio/wei';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import { GasLimitEstimate, NetworkId } from 'constants/networks';
import TransactionData from 'containers/TransactionData';
import Connector from 'containers/Connector';
import { getGasEstimateWithBuffer } from 'utils/network';
import TransactionNotifier from 'containers/TransactionNotifier';
import DistributionContract from 'containers/ContractsInterface/contracts/AelinDistribution';
import { getKeyValue } from 'utils/helpers';

const Airdrop = () => {
	const [showTxModal, setShowTxModal] = useState<boolean>(false);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { gasPrice, setGasPrice } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { walletAddress, network, signer } = Connector.useContainer();
	const airdropDataQuery = useGetAirdropDataForAddress();
	const airdropBalance = airdropDataQuery?.data?.balance ?? null;
	const airdropIndex = airdropDataQuery?.data?.index ?? null;
	const airdropProof = airdropDataQuery?.data?.proof ?? null;

	const canClaimAirdropQuery = useGetCanClaimForAddress(airdropIndex);
	const canClaim = canClaimAirdropQuery?.data ?? false;

	const aelinDistributionContract = useMemo(() => {
		if (!signer || !network?.id) return null;
		const distributionContract = (getKeyValue(DistributionContract) as any)(
			network?.id ?? DEFAULT_NETWORK_ID
		);
		if (!distributionContract) return null;
		return new ethers.Contract(distributionContract.address, distributionContract.abi, signer);
	}, [signer, network?.id]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!walletAddress || !airdropBalance || !canClaim || !aelinDistributionContract) return;
			try {
				const gasEstimate = await aelinDistributionContract.estimateGas.claim(
					airdropIndex,
					walletAddress,
					airdropBalance,
					airdropProof
				);
				setGasLimitEstimate(wei(gasEstimate, 0));
			} catch (e) {
				console.log(e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [
		airdropBalance,
		walletAddress,
		network?.id,
		airdropIndex,
		airdropProof,
		canClaim,
		aelinDistributionContract,
		showTxModal,
	]);

	const isSubmitButtonDisabled = !airdropBalance || !canClaim;

	const handleClaim = useCallback(async () => {
		if (isSubmitButtonDisabled || !gasLimitEstimate || !aelinDistributionContract) return;
		try {
			setShowTxModal(false);

			const tx = await aelinDistributionContract.claim(
				airdropIndex,
				walletAddress,
				airdropBalance,
				airdropProof,
				{
					gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toString(),
					gasPrice: gasPrice.toBN(),
				}
			);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTimeout(() => {
							canClaimAirdropQuery.refetch();
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
			setGasLimitEstimate(null);
		}
	}, [
		aelinDistributionContract,
		airdropBalance,
		airdropIndex,
		airdropProof,
		canClaimAirdropQuery,
		gasLimitEstimate,
		gasPrice,
		monitorTransaction,
		isSubmitButtonDisabled,
		walletAddress,
	]);

	return (
		<>
			<Head>
				<title>Aelin - Claim Tokens</title>
			</Head>

			<PageLayout title={<>vAelin Distribution</>} subtitle="">
				<Row>
					<P>
						{network.id !== NetworkId['Mainnet-ovm']
							? 'Please switch to the Optimism Network by clicking the network tab in the top right'
							: `Stakers on both L1 and L2 are eligible for vAELIN distribution. Using this page, you can check your allocation and process your claims. You can redeem vAELIN for AELIN tokens in near future. Since 2% of vAELIN is paid as fee during redemption, this amount has been reflected in original distribution amount.`}
					</P>
					<Header>{`Allocation: ${ethers.utils.formatEther(airdropBalance ?? 0)} vAELIN`}</Header>
					<SubmitButton
						disabled={isSubmitButtonDisabled}
						onClick={() => setShowTxModal(true)}
						variant="text"
					>
						{canClaim ? 'Claim' : !airdropBalance ? 'Nothing to Claim' : 'Already Claimed'}
					</SubmitButton>
				</Row>
				<ConfirmTransactionModal
					title="Confirm Transaction"
					setIsModalOpen={setShowTxModal}
					isModalOpen={showTxModal}
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
					onSubmit={handleClaim}
				>
					{`You are claiming ${ethers.utils.formatEther(airdropBalance ?? 0)} vAELIN`}
				</ConfirmTransactionModal>
			</PageLayout>
		</>
	);
	return;
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
	font-size: 18px;
	font-weight: bold;
`;

const Header = styled.h3`
	margin: 40px 0 0 0;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 18px;
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 140px;
	margin: 10px auto 0 auto;
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

export default Airdrop;

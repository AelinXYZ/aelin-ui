import Head from 'next/head';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import styled from 'styled-components';
import { useState, useEffect, useMemo, useCallback } from 'react';

import useGetAirdropDataForAddress from 'queries/airdrop/useGetAirdropDataForAddress';
import useGetCanClaimForAddress from 'queries/airdrop/useGetCanClaimForAddress';
import useGetMerkleDataForAddress from 'queries/merkle/useGetMerkleDataForAddress';
import useGetAddressCanClaimMerkle from 'queries/merkle/useGetAddressCanClaimMerkle';

import Button from 'components/Button';
import { FlexDivColCentered, FlexDivRow } from 'components/common';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import TransactionData from 'containers/TransactionData';
import Connector from 'containers/Connector';

import TransactionNotifier from 'containers/TransactionNotifier';
import DistributionContract from 'containers/ContractsInterface/contracts/AelinDistribution';
import SecondDistributionContract from 'containers/ContractsInterface/contracts/SecondAelinDistribution';

import { getKeyValue } from 'utils/helpers';
import { getGasEstimateWithBuffer } from 'utils/network';

import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import { GasLimitEstimate, NetworkId } from 'constants/networks';

import { PageLayout } from 'sections/Layout';
import ConvertSection from 'sections/Claim/ConvertSection';

const Airdrop = () => {
	const [showAelinTxModal, setShowAelinTxModal] = useState<boolean>(false);
	const [showvAelinTxModal, setShowvAelinTxModal] = useState<boolean>(false);
	const [gasAelinLimitEstimate, setAelinGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [gasvAelinLimitEstimate, setvAelinGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { gasPrice, setGasPrice } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { walletAddress, network, signer } = Connector.useContainer();

	// first drop of AELIN
	const merkleDataQuery = useGetMerkleDataForAddress();
	const merkleBalance = merkleDataQuery?.data?.balance ?? null;
	const merkleIndex = merkleDataQuery?.data?.index ?? null;
	const merkleProof = merkleDataQuery?.data?.proof ?? null;
	// first drop of vAELIN
	const airdropDataQuery = useGetAirdropDataForAddress();
	const airdropBalance = airdropDataQuery?.data?.balance ?? null;
	const airdropIndex = airdropDataQuery?.data?.index ?? null;
	const airdropProof = airdropDataQuery?.data?.proof ?? null;

	// first drop of AELIN
	const canClaimMerkleQuery = useGetAddressCanClaimMerkle(merkleIndex);
	const canClaimMerkle = canClaimMerkleQuery?.data ?? false;
	// first drop of vAELIN
	const canClaimAirdropQuery = useGetCanClaimForAddress(airdropIndex);
	const canClaim = canClaimAirdropQuery?.data ?? false;

	// first drop of AELIN
	const aelinDistributionContract = useMemo(() => {
		if (!signer || !network?.id) return null;
		const secondDistributionContract = (getKeyValue(SecondDistributionContract) as any)(
			network?.id ?? DEFAULT_NETWORK_ID
		);
		if (!secondDistributionContract) return null;
		return new ethers.Contract(
			secondDistributionContract.address,
			secondDistributionContract.abi,
			signer
		);
	}, [signer, network?.id]);

	// first drop of vAELIN
	const vAelinDistributionContract = useMemo(() => {
		if (!signer || !network?.id) return null;
		const distributionContract = (getKeyValue(DistributionContract) as any)(
			network?.id ?? DEFAULT_NETWORK_ID
		);
		if (!distributionContract) return null;
		return new ethers.Contract(distributionContract.address, distributionContract.abi, signer);
	}, [signer, network?.id]);

	// first drop of AELIN
	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!walletAddress || !merkleBalance || !canClaimMerkle || !aelinDistributionContract) return;
			try {
				const gasEstimate = await aelinDistributionContract.estimateGas.claim(
					merkleIndex,
					walletAddress,
					merkleBalance,
					merkleProof
				);
				setAelinGasLimitEstimate(wei(gasEstimate, 0));
			} catch (e) {
				console.log(e);
				setAelinGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [
		merkleBalance,
		walletAddress,
		network?.id,
		merkleIndex,
		merkleProof,
		canClaimMerkle,
		aelinDistributionContract,
	]);

	// first drop of vAELIN
	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!walletAddress || !airdropBalance || !canClaim || !vAelinDistributionContract) return;
			try {
				const gasEstimate = await vAelinDistributionContract.estimateGas.claim(
					airdropIndex,
					walletAddress,
					airdropBalance,
					airdropProof
				);
				setvAelinGasLimitEstimate(wei(gasEstimate, 0));
			} catch (e) {
				console.log(e);
				setvAelinGasLimitEstimate(null);
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
		vAelinDistributionContract,
	]);

	const isMerkleSubmitButtonDisabled = !merkleBalance || !canClaimMerkle;
	const isSubmitButtonDisabled = !airdropBalance || !canClaim;

	// first drop of AELIN
	const handleAelinClaim = useCallback(async () => {
		if (isMerkleSubmitButtonDisabled || !gasAelinLimitEstimate || !aelinDistributionContract)
			return;
		try {
			setShowAelinTxModal(false);

			const tx = await aelinDistributionContract.claim(
				merkleIndex,
				walletAddress,
				merkleBalance,
				merkleProof,
				{
					gasLimit: getGasEstimateWithBuffer(gasAelinLimitEstimate)?.toString(),
					gasPrice: gasPrice.toBN(),
				}
			);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => {
						setTimeout(() => {
							canClaimMerkleQuery.refetch();
						}, 5 * 1000);
					},
				});
			}
		} catch (e) {
			console.log(e);
			setAelinGasLimitEstimate(null);
		}
	}, [
		aelinDistributionContract,
		merkleBalance,
		merkleIndex,
		merkleProof,
		canClaimMerkleQuery,
		gasAelinLimitEstimate,
		gasPrice,
		monitorTransaction,
		isMerkleSubmitButtonDisabled,
		walletAddress,
	]);

	// first drop of vAELIN
	const handlevAelinClaim = useCallback(async () => {
		if (isSubmitButtonDisabled || !gasvAelinLimitEstimate || !vAelinDistributionContract) return;
		try {
			setShowvAelinTxModal(false);

			const tx = await vAelinDistributionContract.claim(
				airdropIndex,
				walletAddress,
				airdropBalance,
				airdropProof,
				{
					gasLimit: getGasEstimateWithBuffer(gasvAelinLimitEstimate)?.toString(),
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
			setvAelinGasLimitEstimate(null);
		}
	}, [
		vAelinDistributionContract,
		airdropBalance,
		airdropIndex,
		airdropProof,
		canClaimAirdropQuery,
		gasvAelinLimitEstimate,
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

			<PageLayout title={<>AELIN & vAELIN Distribution</>} subtitle="">
				<FlexDivRow>
					<Row>
						<Header>{`Allocation: ${ethers.utils.formatEther(merkleBalance ?? 0)} AELIN`}</Header>
						<Button
							size="md"
							variant="primary"
							disabled={isMerkleSubmitButtonDisabled}
							onClick={() => setShowAelinTxModal(true)}
						>
							{canClaimMerkle ? 'Claim' : !merkleBalance ? 'Nothing to Claim' : 'Already Claimed'}
						</Button>
						<P>
							{network.id !== NetworkId['Optimism-Mainnet']
								? 'Please switch to the Optimism Network by clicking the network tab in the top right'
								: `If you participated in the pro rata phase of the initial AELIN Pool you may claim your $AELIN tokens here. Retro payments to volunteer devs are also claimable here. Finally, eligible SNX stakers who submitted their addresses before Dec 28th can claim their tokens here. Those who are eligible but submitted after Dec 28 will receive their AELIN tokens after the Jan 15th submittal deadline`}
						</P>
					</Row>
					<Row>
						<Header>{`Allocation: ${ethers.utils.formatEther(airdropBalance ?? 0)} vAELIN`}</Header>
						<Button
							size="md"
							variant="primary"
							disabled={isSubmitButtonDisabled}
							onClick={() => setShowvAelinTxModal(true)}
						>
							{canClaim ? 'Claim' : !airdropBalance ? 'Nothing to Claim' : 'Already Claimed'}
						</Button>
						<P>
							{network.id !== NetworkId['Optimism-Mainnet']
								? 'Please switch to the Optimism Network by clicking the network tab in the top right'
								: `Stakers on both L1 and L2 are eligible for vAELIN distribution. Click claim to get your vAELIN. Once claimed you can convert vAELIN into AELIN via the vAELIN pool on the pools page.`}
						</P>
						<ConvertSection />
					</Row>
				</FlexDivRow>

				<ConfirmTransactionModal
					title="Confirm Transaction"
					setIsModalOpen={setShowAelinTxModal}
					isModalOpen={showAelinTxModal}
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasAelinLimitEstimate}
					onSubmit={handleAelinClaim}
				>
					{`You are claiming ${ethers.utils.formatEther(merkleBalance ?? 0)} AELIN`}
				</ConfirmTransactionModal>

				<ConfirmTransactionModal
					title="Confirm Transaction"
					setIsModalOpen={setShowvAelinTxModal}
					isModalOpen={showvAelinTxModal}
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasvAelinLimitEstimate}
					onSubmit={handlevAelinClaim}
				>
					{`You are claiming ${ethers.utils.formatEther(airdropBalance ?? 0)} vAELIN`}
				</ConfirmTransactionModal>
			</PageLayout>
		</>
	);
};

const Row = styled(FlexDivColCentered)`
	width: 660px;
	height: 550px;
	border-radius: 8px;
	background-color: ${(props) => props.theme.colors.tableSecondary};
	border: 1px solid ${(props) => props.theme.colors.tableBorders};
`;

const P = styled.p`
	text-align: left;
	width: 560px;
	background-color: ${(props) => props.theme.colors.tablePrimary};
	color: ${(props) => props.theme.colors.textBody};
	border: 1px solid ${(props) => props.theme.colors.tableBorders};
	border-radius: 12px;
	padding: 20px;
	font-size: 1rem;
	font-weight: 400;
	margin: 40px 0;
`;

const Header = styled.h3`
	margin: 30px 0;
	color: ${(props) => props.theme.colors.headerPrimary};
	font-weight: 400;
	font-size: 1.4rem;
`;

export default Airdrop;

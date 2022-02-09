import Head from 'next/head';
import { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import Link from 'next/link';

import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import useGetAirdropDataForAddress from 'queries/airdrop/useGetAirdropDataForAddress';
import useGetCanClaimForAddress from 'queries/airdrop/useGetCanClaimForAddress';
import useGetMerkleDataForAddress from 'queries/merkle/useGetMerkleDataForAddress';
import useGetAddressCanClaimMerkle from 'queries/merkle/useGetAddressCanClaimMerkle';
import { PageLayout } from 'sections/Layout';
import { FlexDivColCentered, FlexDivRow } from 'components/common';
import Button from 'components/Button';
import { wei } from '@synthetixio/wei';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import { GasLimitEstimate, NetworkId } from 'constants/networks';
import TransactionData from 'containers/TransactionData';
import Connector from 'containers/Connector';
import { getGasEstimateWithBuffer } from 'utils/network';
import TransactionNotifier from 'containers/TransactionNotifier';
import DistributionContract from 'containers/ContractsInterface/contracts/AelinDistribution';
import SecondDistributionContract from 'containers/ContractsInterface/contracts/SecondAelinDistribution';
import { getKeyValue } from 'utils/helpers';
import ROUTES from 'constants/routes';

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
						<SubmitButton
							disabled={isMerkleSubmitButtonDisabled}
							onClick={() => setShowAelinTxModal(true)}
							variant="text"
						>
							{canClaimMerkle ? 'Claim' : !merkleBalance ? 'Nothing to Claim' : 'Already Claimed'}
						</SubmitButton>
						<P>
							{network.id !== NetworkId['Optimism-Mainnet']
								? 'Please switch to the Optimism Network by clicking the network tab in the top right'
								: `If you participated in the pro rata phase of the initial AELIN Pool you may claim your $AELIN tokens here. Retro payments to volunteer devs are also claimable here. Finally, eligible SNX stakers who submitted their addresses before Dec 28th can claim their tokens here. Those who are eligible but submitted after Dec 28 will receive their AELIN tokens after the Jan 15th submittal deadline`}
						</P>
					</Row>
					<div>
						<Row>
							<Header>{`Allocation: ${ethers.utils.formatEther(
								airdropBalance ?? 0
							)} vAELIN`}</Header>
							<SubmitButton
								disabled={isSubmitButtonDisabled}
								onClick={() => setShowvAelinTxModal(true)}
								variant="text"
							>
								{canClaim ? 'Claim' : !airdropBalance ? 'Nothing to Claim' : 'Already Claimed'}
							</SubmitButton>
							<P>
								{network.id !== NetworkId['Optimism-Mainnet']
									? 'Please switch to the Optimism Network by clicking the network tab in the top right'
									: `Stakers on both L1 and L2 are eligible for vAELIN distribution. Click claim to get your vAELIN. Once claimed you can convert vAELIN into AELIN via the vAELIN pool on the pools page.`}
							</P>
						</Row>
						<Row>
							<Link
								href={ROUTES.Pools.PoolView('0x3074306c0cc9200602bfc64beea955928dac56dd')}
								passHref
							>
								<Anchor>Go to the vAELIN Pool</Anchor>
							</Link>
						</Row>
					</div>
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
	font-size: 1.3rem;
	font-weight: bold;
`;

const Header = styled.h3`
	margin: 40px 0 0 0;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 1.2rem;
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

export default Airdrop;

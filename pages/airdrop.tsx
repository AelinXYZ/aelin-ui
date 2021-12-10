import { useState, useEffect } from 'react';
import styled from 'styled-components';

import useGetAirdropDataForAddress from 'queries/airdrop/useGetAirdropDataForAddress';
import useGetCanClaimForAddress from 'queries/airdrop/useGetCanClaimForAddress';
import { PageLayout } from 'sections/Layout';
import { FlexDivRowCentered, FlexDivColCentered } from 'components/common';
import Button from 'components/Button';
import { wei } from '@synthetixio/wei';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import { GasLimitEstimate } from 'constants/networks';
import TransactionData from 'containers/TransactionData';
import Connector from 'containers/Connector';
import ContractsInterface from 'containers/ContractsInterface';
import { getGasEstimateWithBuffer } from 'utils/network';
import TransactionNotifier from 'containers/TransactionNotifier';

const Airdrop = () => {
	const [showTxModal, setShowTxModal] = useState<boolean>(false);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const { gasPrice, setGasPrice, txState, setTxState } = TransactionData.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { walletAddress } = Connector.useContainer();
	const { contracts } = ContractsInterface.useContainer();
	const airdropDataQuery = useGetAirdropDataForAddress();
	const airdropBalance = airdropDataQuery?.data?.balance ?? null;
	const airdropIndex = airdropDataQuery?.data?.index ?? null;
	const airdropProof = airdropDataQuery?.data?.proof ?? null;

	const canClaimAirdropQuery = useGetCanClaimForAddress(airdropIndex);
	const canClaim = canClaimAirdropQuery?.data ?? false;

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!walletAddress || !contracts?.AelinDistribution || !airdropBalance || !canClaim) return;
			try {
				const gasEstimate = await contracts.AelinDistribution.estimateGas.claim(
					wei(airdropIndex)!.toBN(),
					airdropBalance.toBN(),
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
		contracts?.AelinDistribution,
		airdropIndex,
		airdropProof,
		canClaim,
	]);

	const handleClaim = async () => {
		try {
			if (!contracts || !contracts.AelinDistribution) return;
			setShowTxModal(false);
			const tx = await contracts.AelinDistribution.claim(
				wei(airdropIndex).toBN(),
				airdropBalance!.toBN(),
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
	};

	const isSubmitButtonDisabled = !airdropBalance || airdropBalance.eq(wei(0)) || !canClaim;
	return (
		<PageLayout title={<>Aelin Airdrop</>} subtitle="">
			<Row>
				<P>
					If you are a SNX staker on either L1 or L2, you might be eligible for the AELIN Airdrop.
					This screen will allow you to check your allocation and claim your AELIN.
				</P>
				<Header>{`Allocation: ${airdropBalance?.toString(4) ?? 0} AELIN`}</Header>
				<SubmitButton
					disabled={isSubmitButtonDisabled}
					onClick={() => setShowTxModal(true)}
					variant="text"
				>
					{canClaim ? 'Claim' : 'Already Claimed'}
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
				{`You are claiming ${airdropBalance?.toString(4) ?? 0} AELIN`}
			</ConfirmTransactionModal>
		</PageLayout>
	);
	return;
};

const Row = styled(FlexDivColCentered)`
	width: 500px;
	margin: 0 auto;
`;

const P = styled.p`
	text-align: center;
	width: 500px;
`;

const Header = styled.h3`
	margin: 40px 0 0 0;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 18px;
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 120px;
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

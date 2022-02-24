import { FormikProps } from 'formik';
import styled from 'styled-components';
import { FC, useState, useEffect } from 'react';

import Button from 'components/Button';
import WhiteList from 'components/WhiteList';
import { WhitelistProps } from 'components/WhiteList/types';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import Connector from 'containers/Connector';

import { GasLimitEstimate } from 'constants/networks';
import { TransactionStatus } from 'constants/transactions';

import { Privacy } from 'constants/pool';
import { wei } from '@synthetixio/wei';

export type SummaryItem = {
	label: string;
	text: string | number | JSX.Element;
};

export enum CreateTxType {
	CreatePool = 'CreatePool',
	CreateDeal = 'CreateDeal',
}

interface SummaryBoxProps {
	summaryItems: SummaryItem[];
	txType: CreateTxType;
	isValidForm: boolean;
	formik: FormikProps<any>;
	txState: TransactionStatus;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	handleCancelPool?: () => void;
	cancelGasLimitEstimate?: GasLimitEstimate;
}

const txTypeToTitle = (txType: CreateTxType) => {
	switch (txType) {
		case CreateTxType.CreateDeal:
			return 'Create Deal';
		case CreateTxType.CreatePool:
			return 'Create Pool';
	}
};

const txTypeToHeader = (txType: CreateTxType) => {
	switch (txType) {
		case CreateTxType.CreateDeal:
			return 'Deal Summary';
		case CreateTxType.CreatePool:
			return 'Pool Summary';
	}
};

const SummaryBox: FC<SummaryBoxProps> = ({
	txState,
	formik,
	summaryItems,
	txType,
	isValidForm,
	setGasPrice,
	gasLimitEstimate,
	handleCancelPool,
	cancelGasLimitEstimate,
}) => {
	const { walletAddress } = Connector.useContainer();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [showTxModal, setShowTxModal] = useState<boolean>(false);
	const [showCancelTxModal, setShowCancelTxModal] = useState<boolean>(false);

	const isValid = isValidForm && walletAddress ? true : false;

	const summaryBoxGrid = (
		<SummaryBoxGrid>
			{(summaryItems ?? []).map(({ label, text }, index) => (
				<Item key={`${label}-${index}`}>
					<ItemLabel>{label}:</ItemLabel>
					<ItemText>{text}</ItemText>
				</Item>
			))}
		</SummaryBoxGrid>
	);

	const isPurchaseButtonDisabled = !isValid || txState === TransactionStatus.WAITING;
	const isPrivate = formik.values.poolPrivacy === Privacy.PRIVATE;

	const filteredWhitelist = formik.values.whitelist?.filter(
		(row: WhitelistProps) => row.address.length
	);

	return (
		<Container>
			{txType === CreateTxType.CreateDeal && (
				<CancelButton variant="tertiary" size="lg" onClick={() => setShowCancelTxModal(true)}>
					Cancel Pool
				</CancelButton>
			)}
			<SummaryBoxHeader>{txTypeToHeader(txType)}</SummaryBoxHeader>

			{summaryBoxGrid}

			<PurchaseButtonContainer>
				<StyledButton
					size="lg"
					isRounded
					variant="primary"
					disabled={isPurchaseButtonDisabled}
					onClick={() => {
						setShowTxModal(true);
					}}
				>
					{txTypeToTitle(txType)}
				</StyledButton>
			</PurchaseButtonContainer>

			{txType === CreateTxType.CreatePool && isPrivate && (
				<ButtonContainer>
					<StyledButton
						size="lg"
						isRounded
						variant="secondary"
						onClick={() => setIsModalOpen(!isModalOpen)}
					>
						{`${!filteredWhitelist.length ? 'Add' : 'Edit'} whitelisted addresses`}
					</StyledButton>
				</ButtonContainer>
			)}

			{txType === CreateTxType.CreatePool && (
				<WhiteList
					formik={formik}
					isModalOpen={isModalOpen && isPrivate}
					setIsModalOpen={setIsModalOpen}
				/>
			)}

			<ConfirmTransactionModal
				title={`Confirm ${txTypeToTitle(txType)}`}
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={formik.handleSubmit}
			>
				{summaryBoxGrid}
			</ConfirmTransactionModal>

			{txType === CreateTxType.CreateDeal && (
				<ConfirmTransactionModal
					title={`Confirm Pool Cancellation`}
					setIsModalOpen={setShowCancelTxModal}
					isModalOpen={showCancelTxModal}
					setGasPrice={setGasPrice}
					gasLimitEstimate={cancelGasLimitEstimate ?? wei(0)}
					onSubmit={handleCancelPool}
				>
					In 30 minutes purchasers in your pool will be able to withdraw
				</ConfirmTransactionModal>
			)}
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.boxesBackground};
	width: 350px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.borders};
`;

const CancelButton = styled(Button)`
	color: ${(props) => props.theme.colors.red};
	font-size: 1.2rem;
	position: absolute;
	right: 0;
	top: -45px;
`;

const ButtonContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	bottom: 70px;
	position: absolute;
`;

const PurchaseButtonContainer = styled(ButtonContainer)`
	bottom: 15px;
`;

const StyledButton = styled(Button)`
	width: 280px;
`;

const SummaryBoxHeader = styled.div`
	padding: 20px 20px 0 30px;
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
`;

const SummaryBoxGrid = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	padding: 20px 15px;
	text-align: left;
`;

const Item = styled.div`
	margin: 15px;
`;

const ItemLabel = styled.div`
	color: ${(props) => props.theme.colors.textBody};
	font-size: 1.1rem;
	margin-bottom: 3px;
`;

const ItemText = styled.div`
	font-size: 1rem;
	color: ${(props) => props.theme.colors.textSmall};
`;

export default SummaryBox;

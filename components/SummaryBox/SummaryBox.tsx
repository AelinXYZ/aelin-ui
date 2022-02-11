import { FormikProps } from 'formik';
import styled from 'styled-components';
import { FC, useState, useEffect } from 'react';

import Button from 'components/Button';
import WhiteList from 'components/WhiteList';
import { IWhitelist } from 'components/WhiteList/types';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import Connector from 'containers/Connector';

import { GasLimitEstimate } from 'constants/networks';
import { TransactionStatus } from 'constants/transactions';

import { Privacy } from 'constants/pool';

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
}) => {
	const { walletAddress } = Connector.useContainer();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [showTxModal, setShowTxModal] = useState<boolean>(false);

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

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState]);

	const isPurchaseButtonDisabled = !isValid || txState === TransactionStatus.WAITING;
	const isPrivate = formik.values.poolPrivacy === Privacy.PRIVATE;

	const filteredWhitelist = formik.values.whitelist.filter((row: IWhitelist) => row.address.length);

	return (
		<Container>
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

			{isPrivate && (
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

			<WhiteList
				formik={formik}
				isModalOpen={isModalOpen && isPrivate}
				setIsModalOpen={setIsModalOpen}
			/>

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
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
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
	color: ${(props) => props.theme.colors.headerGreen};
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
	color: ${(props) => props.theme.colors.headerGrey};
	font-size: 1.1rem;
	margin-bottom: 3px;
`;
const ItemText = styled.div`
	font-size: 1rem;
	color: ${(props) => props.theme.colors.black};
`;

export default SummaryBox;

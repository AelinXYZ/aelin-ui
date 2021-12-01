import { FC, useState } from 'react';
import { FormikProps } from 'formik';

import Spinner from 'assets/svg/loader.svg';
import styled from 'styled-components';
import BaseModal from 'components/BaseModal';
import Button from 'components/Button';
import GasSelector from 'components/GasSelector';
import Etherscan from 'containers/BlockExplorer';
import { ExternalLink, StyledSpinner } from 'components/common';
import Connector from 'containers/Connector';
import { GasLimitEstimate } from 'constants/networks';
import { Transaction } from 'constants/transactions';

export type SummaryItem = {
	label: string;
	text: string | number;
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
	txState: Transaction;
	txHash: string | null;
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
	txHash,
	setGasPrice,
	gasLimitEstimate,
}) => {
	const { walletAddress } = Connector.useContainer();
	const [showTxModal, setShowTxModal] = useState<boolean>(false);
	const { blockExplorerInstance } = Etherscan.useContainer();
	const isValid = isValidForm && walletAddress ? true : false;
	const link =
		blockExplorerInstance != null && txHash != null ? blockExplorerInstance.txLink(txHash) : null;
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
	return (
		<Container>
			<SummaryBoxHeader>{txTypeToHeader(txType)}</SummaryBoxHeader>
			{summaryBoxGrid}
			<PurchaseButton
				isValidForm={isValid}
				onClick={() => {
					if (isValid) {
						setShowTxModal(true);
					}
				}}
			>
				{txTypeToTitle(txType)}
			</PurchaseButton>
			<BaseModal
				title={`Confirm ${txTypeToTitle(txType)}`}
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
			>
				{/* TODO create new components for the transaction feedback here */}
				{txState === Transaction.WAITING ? (
					<ModalContainer>
						<StyledSpinner src={Spinner} />
					</ModalContainer>
				) : null}
				{txState === Transaction.SUCCESS ? (
					<ModalContainer>
						Your transaction was completed successfully.
						<div>
							{link != null ? (
								<StyledExternalLink href={link}>Click to see on Etherscan</StyledExternalLink>
							) : null}
						</div>
					</ModalContainer>
				) : null}
				{txType === CreateTxType.CreatePool && txState === Transaction.PRESUBMIT ? (
					<ModalContainer>
						{summaryBoxGrid}
						<hr />
						<GasSelector
							initialGasSpeed="fast"
							setGasPrice={setGasPrice}
							gasLimitEstimate={gasLimitEstimate}
						/>
						<SubmitButton variant="text" type="submit" onClick={() => formik.handleSubmit()}>
							Submit
						</SubmitButton>
					</ModalContainer>
				) : null}
				{txType === CreateTxType.CreateDeal && txState === Transaction.PRESUBMIT ? (
					<ModalContainer>
						{summaryBoxGrid}
						<hr />
						<GasSelector
							initialGasSpeed="fast"
							setGasPrice={setGasPrice}
							gasLimitEstimate={gasLimitEstimate}
						/>
						<SubmitButton variant="text" type="submit" onClick={() => formik.handleSubmit()}>
							Submit
						</SubmitButton>
					</ModalContainer>
				) : null}
			</BaseModal>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const ModalContainer = styled.div`
	text-align: center;
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 120px;
	margin: 10px auto 0 auto;
`;

const SummaryBoxHeader = styled.div`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 12px;
`;

const StyledExternalLink = styled(ExternalLink)`
	color: ${(props) => props.theme.colors.statusBlue};
`;

const SummaryBoxGrid = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	padding: 20px;
	text-align: center;
`;

const Item = styled.div`
	margin: 8px 3px 8px 0;
`;

const ItemLabel = styled.div`
	color: ${(props) => props.theme.colors.headerGrey};
	font-size: 12px;
	margin-bottom: 3px;
`;
const ItemText = styled.div`
	color: ${(props) => props.theme.colors.black};
	font-size: 12px;
`;

const PurchaseButton = styled.div<{ isValidForm: boolean }>`
	cursor: pointer;
	width: 100%;
	height: 56px;
	text-align: center;
	padding-top: 16px;
	font-size: 16px;
	background-color: transparent;
	border: none;
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	color: ${(props) =>
		props.isValidForm ? props.theme.colors.black : props.theme.colors.statusRed};
	&:hover {
		background-color: ${(props) =>
			props.isValidForm ? props.theme.colors.forestGreen : props.theme.colors.statusRed};
		color: ${(props) => props.theme.colors.white};
	}
	position: absolute;
	bottom: 0;
	border-radius: 0 0 8px 8px;
`;

export default SummaryBox;

import { FC, useState, useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Wei, { wei } from '@synthetixio/wei';

import { FlexDiv } from 'components/common';
import { TransactionStatus } from 'constants/transactions';
import Connector from 'containers/Connector';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import { GasLimitEstimate } from 'constants/networks';
import { StakeActions, StakeActionLabel } from 'sections/Stake/constants';
import { InputGroup } from 'components/Input/InputGroup';

export type InputType = {
	placeholder: string;
	label: string;
	symbol: string;
};

interface ActionBoxProps {
	onSubmit: () => void;
	input: InputType;
	onApprove: () => void;
	txState: TransactionStatus;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	setIsMaxValue: (isMax: boolean) => void;
	inputValue: number;
	setInputValue: (num: number) => void;
	balance: Wei;
	isApproved: boolean;
	action: StakeActionLabel;
	setAction: (action: StakeActionLabel) => void;
}

const ActionBox: FC<ActionBoxProps> = ({
	onSubmit,
	input: { placeholder, label, symbol },
	onApprove,
	txState,
	setGasPrice,
	gasLimitEstimate,
	setIsMaxValue,
	inputValue,
	setInputValue,
	action,
	setAction,
	isApproved,
	balance,
}) => {
	const { walletAddress } = Connector.useContainer();
	const [showTxModal, setShowTxModal] = useState(false);

	const modalContent = useMemo(() => {
		if (!isApproved) {
			return {
				onSubmit: onApprove,
				heading: 'Confirm Approval',
			};
		}
		if (action === StakeActionLabel.DEPOSIT) {
			return {
				onSubmit: onSubmit,
				heading: `Confirm deposit of ${inputValue} ${symbol}`,
			};
		}
		if (action === StakeActionLabel.WITHDRAW) {
			return {
				onSubmit: onSubmit,
				heading: `Confirm withdrawal of ${inputValue} ${symbol}`,
			};
		}
	}, [isApproved, onApprove, action, onSubmit, inputValue, symbol]);

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState]);

	const isButtonDisabled: boolean = useMemo(() => {
		if (!isApproved) return false;
		if (!walletAddress || !inputValue) return true;
		if (balance?.toNumber() < inputValue) return true;
		return false;
	}, [walletAddress, inputValue, isApproved, balance]);

	return (
		<Container>
			<ActionTabRow>
				{StakeActions.map((tabAction, i) => (
					<ActionTabElement
						selected={action === tabAction}
						key={`actionTab-${i}`}
						onClick={() => setAction(tabAction)}
					>
						{tabAction}
					</ActionTabElement>
				))}
			</ActionTabRow>
			<ContentContainer>
				<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
				<InputContainer>
					<InputGroup
						icon={
							<div
								onClick={() => {
									if (balance?.gt(wei(0))) {
										setInputValue(balance?.toNumber());
										setIsMaxValue(true);
									}
								}}
							>
								Max
							</div>
						}
						type={'number'}
						placeholder={placeholder}
						value={inputValue}
						onChange={(e) => {
							setIsMaxValue(false);
							setInputValue(parseFloat(e.target.value));
						}}
					/>
					{balance?.toNumber() < inputValue ? <ErrorNote>Max balance exceeded</ErrorNote> : null}
				</InputContainer>
			</ContentContainer>

			<ActionButton
				isWithdraw={action === StakeActionLabel.WITHDRAW}
				disabled={isButtonDisabled}
				onClick={(e) => {
					setShowTxModal(true);
				}}
			>
				{isApproved ? action : 'approve'}
			</ActionButton>

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
		</Container>
	);
};

const ActionTabRow = styled(FlexDiv)`
	border-bottom: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const ActionTabElement = styled.div<{ selected: boolean }>`
	cursor: pointer;
	text-transform: capitalize;
	padding: 6px;
	flex: 1;
	display: flex;
	justify-content: center;
	font-size: 12px;
	background-color: ${(props) =>
		props.selected ? props.theme.colors.cell : props.theme.colors.buttonStroke};
	&:first-child {
		border-right: 1px solid ${(props) => props.theme.colors.buttonStroke};
		border-top-left-radius: 8px;
	}
	&:last-child {
		border-top-right-radius: 8px;
	}
`;

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	width: 300px;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const ActionBoxHeader = styled.div<{ isPool: boolean; isWithdraw?: boolean }>`
	padding: 15px 10px;
	color: ${(props) =>
		props.isWithdraw ? props.theme.colors.statusRed : props.theme.colors.headerGreen};
	font-size: 12px;
	${(props) =>
		!props.isPool &&
		css`
			&:hover {
				cursor: pointer;
			}
		`}
`;

const InputContainer = styled.div`
	position: relative;
`;

const ContentContainer = styled.div`
	padding: 30px 20px;
`;

const ErrorNote = styled.div`
	position: absolute;
	bottom: -18px;
	left: 0;
	color: ${(props) => props.theme.colors.statusRed};
	font-size: 12px;
	font-weight: bold;
`;

const ActionBoxInputLabel = styled.div`
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 11px;
	padding-bottom: 4px;
`;

const ActionButton = styled.button<{ isWithdraw: boolean }>`
	cursor: pointer;
	text-transform: capitalize;
	width: 100%;
	height: 46px;
	background-color: transparent;
	border: none;
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	${(props) => {
		if (props.disabled) {
			return `color: ${props.theme.colors.textGrey};`;
		}
		return `
		color: ${props.theme.colors.black};
		&:hover {
			background-color: ${
				props.isWithdraw ? props.theme.colors.statusRed : props.theme.colors.forestGreen
			};
			color: ${props.theme.colors.white};
		}
		`;
	}}
	border-radius: 0 0 8px 8px;
`;

export default ActionBox;

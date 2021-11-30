import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import Spinner from 'assets/svg/loader.svg';
import Info from 'assets/svg/info.svg';
import Image from 'next/image';

import BaseModal from '../BaseModal';
import OutsideClickHandler from 'react-outside-click-handler';
import { FlexDivRow, FlexDivRowCentered, StyledSpinner, Tooltip } from '../common';
import Button from 'components/Button';
import { Transaction } from 'constants/transactions';
import Connector from 'containers/Connector';

export enum TransactionType {
	Allowance = 'ALLOWANCE',
	Purchase = 'PURCHASE',
	Accept = 'ACCEPT',
	Withdraw = 'WITHDRAW',
	Vest = 'Vest',
}

export enum ActionBoxType {
	FundPool = 'FundPool',
	PendingDeal = 'PENDING_DEAL',
	VestingDeal = 'VESTING_DEAL',
}

export type InputType = {
	placeholder: string;
	label: string;
	value?: string | number;
	maxValue?: string | number;
	symbol?: string;
};

const actionBoxTypeToTitle = (actionBoxType: ActionBoxType) => {
	switch (actionBoxType) {
		case ActionBoxType.FundPool:
			return 'Purchase';
		case ActionBoxType.PendingDeal:
			return 'Accept Deal';
		case ActionBoxType.VestingDeal:
			return 'Vest Deal';
	}
};

const getActionButtonLabel = ({
	actionBoxType,
	isDealAccept,
	allowance,
	amount,
}: {
	actionBoxType: ActionBoxType;
	isDealAccept: boolean;
	allowance: string;
	amount: string | number;
}) => {
	if (Number(allowance) < Number(amount)) {
		return 'Approve';
	}
	switch (actionBoxType) {
		case ActionBoxType.FundPool:
			return 'Purchase';
		case ActionBoxType.PendingDeal:
			return isDealAccept ? 'Accept Deal' : 'Withdraw from Pool';
		case ActionBoxType.VestingDeal:
			return 'Vest Deal';
	}
};

interface ActionBoxProps {
	onSubmit: (value: number | string, transactionType: TransactionType) => void;
	input: InputType;
	actionBoxType: ActionBoxType;
	allowance: string;
	onApprove: () => void;
	txState: Transaction;
	setTxState: (tx: Transaction) => void;
}

const ActionBox: FC<ActionBoxProps> = ({
	onSubmit,
	input: { placeholder, label, value, maxValue, symbol },
	actionBoxType,
	allowance,
	onApprove,
	txState,
	setTxState,
}) => {
	const { walletAddress } = Connector.useContainer();
	const [isDealAccept, setIsDealAccept] = useState(false);
	const [showTxModal, setShowTxModal] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);

	const [inputValue, setInputValue] = useState(value || 0);
	const [txType, setTxType] = useState<TransactionType>(TransactionType.Purchase);
	const isPool = actionBoxType === ActionBoxType.FundPool;
	const canWithdraw = actionBoxType === ActionBoxType.PendingDeal;
	const isVesting = actionBoxType === ActionBoxType.VestingDeal;
	return (
		<Container>
			{canWithdraw ? (
				<RedemptionHeader>
					<OutsideClickHandler
						onOutsideClick={() => {
							setShowTooltip(false);
						}}
					>
						<RedemptionPeriodTooltip
							visible={showTooltip}
							appendTo="parent"
							trigger="click"
							allowHTML
							interactive
							content={
								<div>
									If you max your pro rata contribution you will be eligible for the open redemption
									period where all uncollected deal tokens are available for purchase
								</div>
							}
						>
							<FlexDivRowCentered>
								{`Redemption Period: Pro Rata`}
								<InfoClick onClick={() => setShowTooltip(!showTooltip)}>
									<Image src={Info} alt="" />
								</InfoClick>
							</FlexDivRowCentered>
						</RedemptionPeriodTooltip>
					</OutsideClickHandler>
				</RedemptionHeader>
			) : null}
			<FlexDivRow>
				<ActionBoxHeader onClick={() => setIsDealAccept(true)} isPool={isPool}>
					{actionBoxTypeToTitle(actionBoxType)}
				</ActionBoxHeader>
				{canWithdraw ? (
					<ActionBoxHeader onClick={() => setIsDealAccept(false)} isWithdraw={true} isPool={false}>
						Withdraw
					</ActionBoxHeader>
				) : null}
			</FlexDivRow>
			<ContentContainer>
				{isVesting ? (
					<Paragraph>{maxValue || 0} tokens vested</Paragraph>
				) : (
					<>
						<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
						<InputContainer>
							<ActionBoxInput
								type={'number'}
								placeholder={placeholder}
								value={inputValue}
								onChange={(e) => {
									setInputValue(parseFloat(e.target.value));
								}}
							/>
							{maxValue && <ActionBoxMax onClick={() => setInputValue(maxValue)}>Max</ActionBoxMax>}
						</InputContainer>
					</>
				)}
			</ContentContainer>
			<ActionButton
				disabled={
					!walletAddress ||
					(actionBoxType === ActionBoxType.VestingDeal && !maxValue) ||
					(actionBoxType !== ActionBoxType.VestingDeal &&
						(!inputValue || Number(inputValue) === 0)) ||
					(actionBoxType !== ActionBoxType.VestingDeal &&
						Number(maxValue ?? 0) < Number(inputValue ?? 0))
				}
				isWithdraw={actionBoxType === ActionBoxType.PendingDeal && !isDealAccept}
				onClick={(e) => {
					const setCorrectTxnType = () => {
						if (isPool && Number(allowance ?? 0) < Number(inputValue ?? 0)) {
							return setTxType(TransactionType.Allowance);
						}
						if (isPool) {
							return setTxType(TransactionType.Purchase);
						}
						if (actionBoxType === ActionBoxType.PendingDeal && isDealAccept) {
							return setTxType(TransactionType.Accept);
						}
						if (actionBoxType === ActionBoxType.PendingDeal && !isDealAccept) {
							return setTxType(TransactionType.Withdraw);
						}
						if (actionBoxType === ActionBoxType.VestingDeal) {
							return setTxType(TransactionType.Vest);
						}
					};
					setCorrectTxnType();
					setShowTxModal(true);
				}}
			>
				{getActionButtonLabel({ actionBoxType, isDealAccept, allowance, amount: inputValue })}
			</ActionButton>
			{actionBoxType !== ActionBoxType.VestingDeal &&
			Number(maxValue ?? 0) < Number(inputValue ?? 0) ? (
				<ErrorNote>Max balance exceeded</ErrorNote>
			) : null}
			<BaseModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				onClose={() => setTxState(Transaction.PRESUBMIT)}
			>
				{/* TODO create new components for the transaction feedback here */}
				{txState === Transaction.SUCCESS ? (
					<div>
						<div>Your transaction has been submitted successfully</div>
					</div>
				) : null}
				{txState === Transaction.WAITING ? <StyledSpinner src={Spinner} /> : null}
				{txType === TransactionType.Allowance && txState === Transaction.PRESUBMIT ? (
					<div>
						<div>{`Please approve ${symbol} usage by the pool contract`}</div>
						<SubmitButton
							variant={'text'}
							isWithdraw={false}
							onClick={(e) => {
								setTxState(Transaction.WAITING);
								onApprove();
							}}
						>
							Confirm Approval
						</SubmitButton>
					</div>
				) : null}
				{txType === TransactionType.Purchase && txState === Transaction.PRESUBMIT ? (
					<div>
						<div>You are going to purchase for {inputValue}</div>
						<SubmitButton
							variant={'text'}
							isWithdraw={false}
							onClick={(e) => {
								setTxState(Transaction.WAITING);
								onSubmit(inputValue, txType);
							}}
						>
							Confirm Purchase
						</SubmitButton>
					</div>
				) : null}
				{txType === TransactionType.Accept && txState === Transaction.PRESUBMIT ? (
					<div>
						<div>You are accepting {inputValue} tokens</div>
						<SubmitButton
							variant={'text'}
							isWithdraw={false}
							onClick={(e) => {
								setTxState(Transaction.WAITING);
								onSubmit(inputValue, txType);
							}}
						>
							Confirm Accept
						</SubmitButton>
					</div>
				) : null}
				{txType === TransactionType.Withdraw && txState === Transaction.PRESUBMIT ? (
					<div>
						<div>You are withdrawing {inputValue} tokens</div>
						<SubmitButton
							variant={'text'}
							isWithdraw={true}
							onClick={(e) => {
								setTxState(Transaction.WAITING);
								onSubmit(inputValue, txType);
							}}
						>
							Confirm Withdraw
						</SubmitButton>
					</div>
				) : null}
				{txType === TransactionType.Vest && txState === Transaction.PRESUBMIT && maxValue ? (
					<div>
						<div>You are vesting {maxValue}</div>
						<SubmitButton
							variant={'text'}
							isWithdraw={true}
							onClick={(e) => {
								setTxState(Transaction.WAITING);
								onSubmit(maxValue, txType);
							}}
						>
							Confirm Vesting
						</SubmitButton>
					</div>
				) : null}
			</BaseModal>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	max-height: 400px;
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const ActionBoxHeader = styled.div<{ isPool: boolean; isWithdraw?: boolean }>`
	padding: 15px 20px;
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

const RedemptionHeader = styled.div`
	background-color: ${(props) => props.theme.colors.forestGreen};
	height: 30px;
	width: 100%;
	color: ${(props) => props.theme.colors.white};
	text-align: center;
	padding-top: 7px;
	font-size: 12px;
	border-radius: 4px 4px 0 0;
`;

const SubmitButton = styled(Button)<{ isWithdraw: boolean }>`
	background-color: ${(props) =>
		props.isWithdraw ? props.theme.colors.statusRed : props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
`;

const RedemptionPeriodTooltip = styled(Tooltip)`
	background-color: ${(props) => props.theme.colors.forestGreen};
`;

const InfoClick = styled.div`
	padding-left: 5px;
	cursor: pointer;
	display: inline;
`;

const InputContainer = styled.div`
	position: relative;
`;

const ContentContainer = styled.div`
	padding: 15px 20px;
`;

const Paragraph = styled.p`
	color: ${(props) => props.theme.colors.black};
	font-size: 12px;
`;

const ErrorNote = styled.div`
	color: ${(props) => props.theme.colors.statusRed};
	padding-left: 20px;
	font-size: 12px;
	font-weight: bold;
`;

const ActionBoxInputLabel = styled.div`
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 11px;
	padding-bottom: 4px;
`;

const ActionBoxInput = styled.input`
	outline: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: ${(props) => props.theme.colors.background};
	border-radius: 4px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 6px 12px;
	&::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		font-size: 12px;
	}
`;

const ActionBoxMax = styled.div`
	position: absolute;
	width: 33px;
	height: 21px;
	left: 215px;
	text-align: center;
	padding-top: 4px;
	padding-left: 2px;
	top: 7px;
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 11px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 100px;
	&:hover {
		cursor: pointer;
	}
`;

const ActionButton = styled.button<{ isWithdraw: boolean }>`
	cursor: pointer;
	width: 100%;
	height: 56px;
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

	position: absolute;
	bottom: 0;
	border-radius: 0 0 8px 8px;
`;

export default ActionBox;

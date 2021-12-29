import { FC, useState, useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Info from 'assets/svg/info.svg';
import Image from 'next/image';

import { FlexDivRow, FlexDivRowCentered, Tooltip, FlexDiv } from 'components/common';
import { TransactionStatus, TransactionType } from 'constants/transactions';
import Connector from 'containers/Connector';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import QuestionMark from 'components/QuestionMark';
import { GasLimitEstimate } from 'constants/networks';
import { Status } from 'components/DealStatus';
import { statusToText } from 'constants/pool';

import { StakeActions } from 'sections/Stake/constants';

export type InputType = {
	placeholder: string;
	label: string;
	maxValue?: string | number;
	symbol?: string;
};

interface ActionBoxProps {
	onSubmit: () => void;
	input: InputType;
	allowance?: string;
	onApprove?: () => void;
	txState: TransactionStatus;
	isPurchaseExpired?: boolean;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	privatePoolDetails?: { isPrivatePool: boolean; privatePoolAmount: string };
	dealRedemptionData?: {
		status: Status;
		maxProRata: string;
		isOpenEligible: boolean;
		purchaseTokenTotalForDeal: number;
		totalAmountAccepted: number;
	};
	setTxType: (txnType: TransactionType) => void;
	txType: TransactionType;
	setIsMaxValue: (isMax: boolean) => void;
	inputValue: number;
	setInputValue: (num: number) => void;
	purchaseCurrency?: string;
	poolId?: string;
}

const ActionBox: FC<ActionBoxProps> = ({
	onSubmit,
	input: { placeholder, label, maxValue },
	allowance,
	onApprove,
	txState,
	isPurchaseExpired,
	setGasPrice,
	gasLimitEstimate,
	dealRedemptionData,
	setTxType,
	txType,
	setIsMaxValue,
	inputValue,
	setInputValue,
	purchaseCurrency,
	action,
	setAction,
}) => {
	const { walletAddress } = Connector.useContainer();
	const [showTxModal, setShowTxModal] = useState(false);

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState]);

	const isDisabled: boolean = useMemo(() => {
		return !walletAddress || !inputValue || Number(inputValue) === 0;
	}, [walletAddress, inputValue]);

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
					<ActionBoxInput
						type={'number'}
						placeholder={placeholder}
						value={inputValue}
						onChange={(e) => {
							setIsMaxValue(false);
							setInputValue(parseFloat(e.target.value));
						}}
					/>
					{maxValue ? (
						<ActionBoxMax
							isProRata={dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw}
							onClick={() => console.log('here')}
						>
							{dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw
								? 'Max Pro Rata'
								: 'Max'}
						</ActionBoxMax>
					) : null}
				</InputContainer>
			</ContentContainer>

			<ActionButton
				disabled={isDisabled}
				// isWithdraw={isWithdraw}
				onClick={(e) => {
					setShowTxModal(true);
				}}
			>
				{action}
			</ActionButton>

			{/* {actionBoxType !== ActionBoxType.VestingDeal &&
			Number(maxValue ?? 0) < Number(inputValue ?? 0) ? (
				<ErrorNote>Max balance exceeded</ErrorNote>
			) : null}
			{actionBoxType === ActionBoxType.AcceptOrRejectDeal &&
			dealRedemptionData?.status === Status.ProRataRedemption &&
			!isWithdraw &&
			Number(dealRedemptionData.maxProRata ?? 0) < Number(inputValue ?? 0) ? (
				<ErrorNote>More than pro rata amount</ErrorNote>
			) : null}
			{actionBoxType === ActionBoxType.AcceptOrRejectDeal &&
			dealRedemptionData?.status === Status.Closed &&
			!isWithdraw &&
			Number(inputValue ?? 0) > 0 ? (
				<ErrorNote>Redemption period is closed</ErrorNote>
			) : null}
			{actionBoxType === ActionBoxType.AcceptOrRejectDeal &&
			dealRedemptionData?.status === Status.OpenRedemption &&
			!dealRedemptionData.isOpenEligible &&
			!isWithdraw &&
			Number(inputValue ?? 0) > 0 ? (
				<ErrorNote>You are not eligible for open redemption period</ErrorNote>
			) : null} */}
			{/* <ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={modalContent[txType].onSubmit}
			>
				{modalContent[txType].heading}
			</ConfirmTransactionModal> */}
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
		props.selected ? props.theme.colors.buttonStroke : props.theme.colors.cell};
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
	/* position: relative; */
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;
const ActionBoxHeaderWrapper = styled(FlexDivRow)`
	margin-top: 20px;
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

const RedemptionHeader = styled.div`
	background-color: ${(props) => props.theme.colors.forestGreen};
	height: 32px;
	width: 100%;
	color: ${(props) => props.theme.colors.white};
	text-align: center;
	padding-top: 7px;
	font-size: 12px;
	border-radius: 4px 4px 0 0;
`;

const RedemptionPeriodTooltip = styled(Tooltip)`
	background-color: ${(props) => props.theme.colors.forestGreen};
`;

const InfoClick = styled.div`
	padding-left: 8px;
	padding-top: 3px;
	cursor: pointer;
	display: inline;
`;

const InputContainer = styled.div`
	position: relative;
`;

const ContentContainer = styled.div`
	padding: 30px 20px;
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

const ActionBoxMax = styled.div<{ isProRata: boolean }>`
	position: absolute;
	width: ${(props) => (props.isProRata ? '85px' : '33px')};
	height: 21px;
	left: ${(props) => (props.isProRata ? '190px' : '210px')};
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

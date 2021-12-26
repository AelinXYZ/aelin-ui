//@ts-nocheck
import { FC, useState, useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Info from 'assets/svg/info.svg';
import Image from 'next/image';

import { FlexDivRow, FlexDivRowCentered, Tooltip } from '../common';
import { TransactionStatus, TransactionType } from 'constants/transactions';
import Connector from 'containers/Connector';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import QuestionMark from 'components/QuestionMark';
import { GasLimitEstimate } from 'constants/networks';
import { Status } from 'components/DealStatus';
import { statusToText } from 'constants/pool';

export enum ActionBoxType {
	FundPool = 'FundPool',
	AcceptOrRejectDeal = 'ACCEPT_OR_REJECT_DEAL',
	VestingDeal = 'VESTING_DEAL',
	Stake = 'STAKE',
}

export type InputType = {
	placeholder: string;
	label: string;
	maxValue?: string | number;
	symbol?: string;
};

const actionBoxTypeToTitle = (
	actionBoxType: ActionBoxType,
	isPrivatePool: boolean,
	privatePoolAmount: string,
	currency: string
) => {
	const privatePoolText = (
		<div>
			<div>Private pool</div>
			<div>{`${
				privatePoolAmount && Number(privatePoolAmount) > 0
					? `You may purchase up to ${privatePoolAmount} ${currency}`
					: 'You have no allocation'
			}`}</div>
		</div>
	);
	const publicPoolText = 'Public pool';
	switch (actionBoxType) {
		case ActionBoxType.FundPool:
			return isPrivatePool ? privatePoolText : publicPoolText;
		case ActionBoxType.AcceptOrRejectDeal:
			return 'Accept Deal';
		case ActionBoxType.VestingDeal:
			return 'Vest Deal';
		case ActionBoxType.Stake:
			return 'Stake';
	}
};

const getActionButtonLabel = ({
	actionBoxType,
	isDealAccept,
	allowance,
	amount,
	isPurchaseExpired,
	isPrivatePoolAndNoAllocation,
}: {
	actionBoxType: ActionBoxType;
	isDealAccept: boolean;
	allowance?: string;
	amount: string | number;
	isPurchaseExpired: boolean | undefined;
}) => {
	if (actionBoxType === ActionBoxType.FundPool && isPrivatePoolAndNoAllocation) {
		return 'No Allocation';
	}
	if (actionBoxType === ActionBoxType.FundPool && Number(allowance ?? '0') < Number(amount)) {
		return 'Approve';
	}
	switch (actionBoxType) {
		case ActionBoxType.FundPool:
			return isPurchaseExpired ? 'Purchase Expired' : 'Purchase';
		case ActionBoxType.AcceptOrRejectDeal:
			return isDealAccept ? 'Accept Deal' : 'Withdraw from Pool';
		case ActionBoxType.VestingDeal:
			return 'Vest Deal';
		case ActionBoxType.Stake:
			return 'Stake';
	}
};

interface ActionBoxProps {
	onSubmit: () => void;
	input: InputType;
	actionBoxType: ActionBoxType;
	allowance?: string;
	onApprove?: () => void;
	txState: TransactionStatus;
	isPurchaseExpired?: boolean;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	privatePoolDetails?: { isPrivatePool: boolean; privatePoolAmount: string };
	dealRedemptionData?: { status: Status; maxProRata: string; isOpenEligible: boolean };
	setTxType: (txnType: TransactionType) => void;
	txType: TransactionType;
	setIsMaxValue: (isMax: boolean) => void;
	inputValue: number;
	setInputValue: (num: number) => void;
	purchaseCurrency?: string;
}

const ActionBox: FC<ActionBoxProps> = ({
	onSubmit,
	input: { placeholder, label, maxValue },
	actionBoxType,
	allowance,
	onApprove,
	txState,
	isPurchaseExpired,
	setGasPrice,
	gasLimitEstimate,
	privatePoolDetails,
	dealRedemptionData,
	setTxType,
	txType,
	setIsMaxValue,
	inputValue,
	setInputValue,
	purchaseCurrency,
}) => {
	const { walletAddress } = Connector.useContainer();
	const [isDealAccept, setIsDealAccept] = useState(false);
	const [showTxModal, setShowTxModal] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);

	const isPool = actionBoxType === ActionBoxType.FundPool;
	const isAcceptOrReject = actionBoxType === ActionBoxType.AcceptOrRejectDeal;
	const isVesting = actionBoxType === ActionBoxType.VestingDeal;
	const isWithdraw = isAcceptOrReject && !isDealAccept;

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState]);

	const modalContent = useMemo(
		() => ({
			[TransactionType.Allowance]: {
				heading: 'Confirm Approval',
				onSubmit: onApprove,
			},
			[TransactionType.Purchase]: {
				heading: `You are purchasing ${inputValue} ${purchaseCurrency}`,
				onSubmit,
			},
			[TransactionType.Accept]: {
				heading: `You are accepting ${inputValue} deal tokens`,
				onSubmit,
			},
			[TransactionType.Withdraw]: {
				heading: `You are withdrawing ${inputValue} ${purchaseCurrency}`,
				onSubmit,
			},
			[TransactionType.Vest]: {
				heading: `You are vesting ${maxValue} tokens`,
				onSubmit,
			},
			[TransactionType.Stake]: {
				heading: `You are staking ${inputValue}`,
				onSubmit,
			},
		}),
		[inputValue, maxValue, onApprove, onSubmit, purchaseCurrency]
	);

	const isPrivatePoolAndNoAllocation = useMemo(
		() => privatePoolDetails?.isPrivatePool && !privatePoolDetails?.privatePoolAmount,
		[privatePoolDetails?.isPrivatePool, privatePoolDetails?.privatePoolAmount]
	);

	const isDisabled: boolean = useMemo(() => {
		return (
			!walletAddress ||
			(!isWithdraw && isPurchaseExpired) ||
			(actionBoxType === ActionBoxType.VestingDeal && !maxValue) ||
			(actionBoxType !== ActionBoxType.VestingDeal && (!inputValue || Number(inputValue) === 0)) ||
			(actionBoxType !== ActionBoxType.VestingDeal &&
				Number(maxValue ?? 0) < Number(inputValue ?? 0))
		);
	}, [walletAddress, isWithdraw, isPurchaseExpired, actionBoxType, maxValue, inputValue]);

	return (
		<Container>
			{isAcceptOrReject && dealRedemptionData?.status != null ? (
				<RedemptionHeader>
					<RedemptionPeriodTooltip
						visible={showTooltip}
						appendTo="parent"
						trigger="click"
						allowHTML
						interactive
						content={
							<div>
								A max pro rata contribution makes you eligible for the open redemption period where
								unredeemed deal tokens are available
							</div>
						}
					>
						<FlexDivRowCentered>
							{statusToText(dealRedemptionData.status)}
							<InfoClick onClick={() => setShowTooltip(!showTooltip)}>
								<Image src={Info} alt="" />
							</InfoClick>
						</FlexDivRowCentered>
					</RedemptionPeriodTooltip>
				</RedemptionHeader>
			) : null}
			<ContentContainer>
				{isVesting ? (
					<Paragraph>{maxValue || 0} tokens to vest</Paragraph>
				) : (
					<>
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
									onClick={() => {
										let max = maxValue;
										if (privatePoolDetails?.isPrivatePool && !isWithdraw) {
											max = Math.min(
												Number(privatePoolDetails?.privatePoolAmount ?? 0),
												Number(maxValue)
											);
										}
										if (dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw) {
											max = Math.min(
												Number(max),
												Number(deal?.purchaseTokenTotalForDeal ?? 0) -
													Number(dealRedemptionData.totalAmountAccepted ?? 0)
											);
										}
										if (
											dealRedemptionData?.status === Status.OpenRedemption &&
											dealRedemptionData.isOpenEligible
										) {
											max = Math.min(Number(max), Number(dealRedemptionData?.remainingAmount));
										}
										if (
											(dealRedemptionData?.status === Status.Closed ||
												(dealRedemptionData?.status === Status.OpenRedemption &&
													!dealRedemptionData.isOpenEligible)) &&
											!isWithdraw
										) {
											max = 0;
										}
										setIsMaxValue(true);
										setInputValue(Number(max));
									}}
								>
									{dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw
										? 'Max Pro Rata'
										: 'Max'}
								</ActionBoxMax>
							) : null}
						</InputContainer>
						<ActionBoxHeaderWrapper>
							<ActionBoxHeader onClick={() => setIsDealAccept(true)} isPool={isPool}>
								<FlexDivRow>
									<>
										{actionBoxTypeToTitle(
											actionBoxType,
											privatePoolDetails?.isPrivatePool ?? false,
											privatePoolDetails?.privatePoolAmount ?? '0',
											purchaseCurrency
										)}
									</>{' '}
									{actionBoxType === ActionBoxType.AcceptOrRejectDeal ? (
										<QuestionMark text="choose accept to agree to the deal terms with up to the max amount based on your allocation this round" />
									) : null}
								</FlexDivRow>
							</ActionBoxHeader>
							{isAcceptOrReject ? (
								<ActionBoxHeader
									onClick={() => setIsDealAccept(false)}
									isWithdraw={true}
									isPool={false}
								>
									<FlexDivRow>
										<>Withdraw</>
										<QuestionMark text="reject deal and withdraw your capital" />
									</FlexDivRow>
								</ActionBoxHeader>
							) : null}
						</ActionBoxHeaderWrapper>
					</>
				)}
			</ContentContainer>
			<ActionButton
				disabled={isDisabled}
				isWithdraw={isWithdraw}
				onClick={(e) => {
					const setCorrectTxnType = () => {
						if (isPool && Number(allowance ?? 0) < Number(inputValue ?? 0)) {
							return setTxType(TransactionType.Allowance);
						}
						if (isPool) {
							return setTxType(TransactionType.Purchase);
						}
						if (actionBoxType === ActionBoxType.AcceptOrRejectDeal && isDealAccept) {
							return setTxType(TransactionType.Accept);
						}
						if (isWithdraw) {
							return setTxType(TransactionType.Withdraw);
						}
						if (actionBoxType === ActionBoxType.VestingDeal) {
							return setTxType(TransactionType.Vest);
						}
						if (actionBoxType === ActionBoxType.Stake) {
							return setTxType(TransactionType.Stake);
						}
					};
					setCorrectTxnType();
					setShowTxModal(true);
				}}
			>
				{getActionButtonLabel({
					isPurchaseExpired,
					actionBoxType,
					isDealAccept,
					allowance,
					amount: inputValue,
					isPrivatePoolAndNoAllocation,
				})}
			</ActionButton>
			{actionBoxType !== ActionBoxType.VestingDeal &&
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
			) : null}
			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={modalContent[txType].onSubmit}
			>
				{modalContent[txType].heading}
			</ConfirmTransactionModal>
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

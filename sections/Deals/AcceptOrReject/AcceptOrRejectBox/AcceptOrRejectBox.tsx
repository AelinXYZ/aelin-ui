import Image from 'next/image';
import styled from 'styled-components';
import { FC, useEffect, useState, useMemo, ChangeEvent } from 'react';

import Info from 'assets/svg/info.svg';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

import { Status } from 'components/DealStatus';
import QuestionMark from 'components/QuestionMark';
import { FlexDivRowCentered, Tooltip } from 'components/common';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import {
	Container,
	ContentContainer,
	ActionBoxInputLabel,
	InputContainer,
	ActionBoxInput,
	ActionBoxMax,
	ActionBoxHeaderWrapper,
	ActionBoxHeader,
	FlexDivCenterRow,
	ActionButton,
} from 'sections/shared/common';

import { GasLimitEstimate } from 'constants/networks';
import { TransactionDealType } from 'constants/transactions';
import { statusToText } from 'constants/pool';

import AcceptOrRejectError from '../AcceptOrRejectError';
import { Tab, Tabs } from 'components/Tabs';
import { InputGroup } from 'components/Input/InputGroup';
import Button from 'components/Button';
import { ethers } from 'ethers';

interface AcceptOrRejectDealBoxProps {
	txType: TransactionDealType;
	setTxType: (txType: TransactionDealType) => void;
	onSubmit: () => void;
	inputValue: number | string;
	setInputValue: (val: number | string) => void;
	setIsMaxValue: (val: boolean) => void;
	userPoolBalance: string | null;
	userPurchaseBalance: string | null;
	purchaseTokenSymbol: string | null;
	underlyingDealTokenSymbol: string | null;
	gasLimitEstimate: GasLimitEstimate;
	purchaseCurrency: string | null;
	exchangeRatePurchaseUnderlying: string | null;
	dealRedemptionData: {
		status: Status;
		maxProRata: number;
		isOpenEligible: boolean;
		purchaseTokenTotalForDeal: number;
		totalAmountAccepted: number;
	};
}

const AcceptOrRejectDealBox: FC<AcceptOrRejectDealBoxProps> = ({
	txType,
	setTxType,
	onSubmit,
	inputValue,
	setInputValue,
	setIsMaxValue,
	userPoolBalance,
	userPurchaseBalance,
	purchaseTokenSymbol,
	underlyingDealTokenSymbol,
	gasLimitEstimate,
	purchaseCurrency,
	dealRedemptionData,
	exchangeRatePurchaseUnderlying,
}) => {
	const [dealRedemptionEnded, setDealRedemptionEnded] = useState<boolean>(
		dealRedemptionData?.status === Status.Closed
	);

	const { walletAddress } = Connector.useContainer();
	const { setGasPrice } = TransactionData.useContainer();

	const [showTooltip, setShowTooltip] = useState(false);
	const [showTxModal, setShowTxModal] = useState(false);

	const isEmptyInput = inputValue === '' || Number(inputValue) === 0;
	const hasAmount = Number(isEmptyInput ? 0 : inputValue) > 0;
	const isMaxBalanceExceeded = Number(userPoolBalance ?? 0) < Number(isEmptyInput ? 0 : inputValue);
	const isRedemptionPeriodClosed = dealRedemptionData?.status === Status.Closed;
	const isProRataRedemptionPeriod = dealRedemptionData?.status === Status.ProRataRedemption;
	const isEligibleForOpenRedemption =
		dealRedemptionData?.status === Status.OpenRedemption && !dealRedemptionData.isOpenEligible;
	const isProRataAmountExcceded =
		Number(dealRedemptionData.maxProRata ?? 0) < Number(isEmptyInput ? 0 : inputValue);
	const isWithdraw = txType === TransactionDealType.Withdraw;

	const isButtonDisabled: boolean = useMemo(
		() =>
			!walletAddress ||
			isMaxBalanceExceeded ||
			!hasAmount ||
			(isProRataRedemptionPeriod && !isWithdraw && isProRataAmountExcceded) ||
			(isRedemptionPeriodClosed && !isWithdraw && hasAmount) ||
			(isEligibleForOpenRedemption && !isWithdraw && hasAmount),
		[
			walletAddress,
			isMaxBalanceExceeded,
			isProRataRedemptionPeriod,
			isWithdraw,
			isProRataAmountExcceded,
			isRedemptionPeriodClosed,
			hasAmount,
			isEligibleForOpenRedemption,
		]
	);

	const isAcceptDealDisabled: boolean = useMemo(
		() =>
			!walletAddress ||
			(isProRataRedemptionPeriod && !isWithdraw && isProRataAmountExcceded) ||
			(isRedemptionPeriodClosed && !isWithdraw) ||
			(isEligibleForOpenRedemption && !isWithdraw),
		[
			walletAddress,
			isProRataRedemptionPeriod,
			isWithdraw,
			isProRataAmountExcceded,
			isRedemptionPeriodClosed,
			isEligibleForOpenRedemption,
		]
	);

	const modalContent = useMemo(
		() => ({
			[TransactionDealType.AcceptDeal]: {
				heading: `You are accepting ${inputValue} deal tokens`,
				onSubmit,
			},
			[TransactionDealType.Withdraw]: {
				heading: `You are withdrawing ${inputValue} ${purchaseCurrency}`,
				onSubmit,
			},
		}),
		[inputValue, onSubmit, purchaseCurrency]
	);

	const handleMaxButtonClick = () => {
		let maxValue = Number(Number(userPoolBalance) * Number(exchangeRatePurchaseUnderlying));

		if (dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw) {
			maxValue = Math.min(Number(maxValue), Number(dealRedemptionData.maxProRata ?? 0));
		} else if (
			dealRedemptionData?.status === Status.OpenRedemption &&
			dealRedemptionData.isOpenEligible &&
			!isWithdraw
		) {
			maxValue = Math.min(
				dealRedemptionData?.purchaseTokenTotalForDeal - dealRedemptionData?.totalAmountAccepted,
				maxValue
			);
		} else if (
			(dealRedemptionData?.status === Status.Closed ||
				(dealRedemptionData?.status === Status.OpenRedemption &&
					!dealRedemptionData.isOpenEligible)) &&
			!isWithdraw
		) {
			maxValue = 0;
		}

		setIsMaxValue(true);
		setInputValue(maxValue);
	};

	const handleMaxWithdrawButtonClick = () => setInputValue(userPoolBalance || 0);
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = !!e?.target?.value.length ? parseFloat(e.target.value) : '';
		setIsMaxValue(false);
		setInputValue(value);
	};

	return (
		<Wrapper>
			<Tabs
				defaultIndex={Number(dealRedemptionEnded)}
				onSelect={(selectedIndex: number) => {
					if (selectedIndex === 0) return setTxType(TransactionDealType.AcceptDeal);
					if (selectedIndex === 1) return setTxType(TransactionDealType.Withdraw);

					throw new Error('Unexpected Index');
				}}
			>
				<Tab label="Accept deal" disabled={isAcceptDealDisabled}>
					<StyledContainer>
						<Header>Deal allocation round 1</Header>
						<Subtitle>
							By clicking "accept deal" you are agreeing to the negotiated exchange rate
						</Subtitle>
						<InputGroup
							type={'number'}
							value={inputValue}
							disabled={dealRedemptionEnded}
							onChange={handleInputChange}
							max={userPoolBalance ?? undefined}
							icon={
								<div onClick={handleMaxButtonClick}>
									{dealRedemptionData?.status === Status.ProRataRedemption ? 'Max Pro Rata' : 'Max'}
								</div>
							}
						/>
						<ActionBoxInputLabelFede>
							Balance {Number(userPoolBalance) * Number(exchangeRatePurchaseUnderlying) ?? ''}{' '}
							{underlyingDealTokenSymbol}
						</ActionBoxInputLabelFede>
						<ButtonWrapper>
							<StyledButton
								variant="primary"
								fullWidth
								isRounded
								disabled={isButtonDisabled}
								onClick={() => {
									setTxType(TransactionDealType.AcceptDeal);
									setShowTxModal(true);
								}}
							>
								Accept deal
							</StyledButton>
						</ButtonWrapper>
					</StyledContainer>
				</Tab>
				<Tab label="Withdraw">
					<StyledContainer>
						<Header>Withdraw tokens</Header>
						<Subtitle>
							{dealRedemptionEnded
								? 'Deal Closed'
								: "If you didn't accept, or only partially accepted the deal you may withdraw your tokens from the pool"}
						</Subtitle>
						<InputGroup
							type={'number'}
							value={inputValue}
							onChange={handleInputChange}
							icon={<div onClick={handleMaxWithdrawButtonClick}>Max</div>}
						/>
						<ActionBoxInputLabelFede>
							Balance {userPoolBalance ?? ''} {purchaseTokenSymbol}
						</ActionBoxInputLabelFede>
						<AcceptOrRejectError
							hasAmount={hasAmount}
							isWithdraw={isWithdraw}
							isMaxBalanceExceeded={isMaxBalanceExceeded}
							isProRataAmountExcceded={isProRataAmountExcceded}
							isRedemptionPeriodClosed={isRedemptionPeriodClosed}
							isProRataRedemptionPeriod={isProRataRedemptionPeriod}
							isEligibleForOpenRedemption={isEligibleForOpenRedemption}
						/>
						<ButtonWrapper>
							<StyledButton
								variant="primary"
								fullWidth
								isRounded
								disabled={isButtonDisabled}
								onClick={() => {
									setTxType(TransactionDealType.Withdraw);
									setShowTxModal(true);
								}}
							>
								Withdraw
							</StyledButton>
						</ButtonWrapper>
					</StyledContainer>
				</Tab>
			</Tabs>
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
		</Wrapper>
	);
};

const StyledContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	padding: 15px;
	height: 250px;
`;

const Subtitle = styled.p``;

const StyledButton = styled(Button)`
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	font-size: 0.85rem;
`;

const ButtonWrapper = styled.div`
	position: absolute;
	bottom: 15px;
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
	width: 90%;
`;
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: -59px;
`;

const Header = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 600;
	margin: 0;
	padding: 0;
`;

const ActionBoxInputLabelFede = styled.p`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1rem;
	margin-top: 7.5px;
	padding-bottom: 4px;
`;

const RedemptionHeader = styled.div`
	background-color: ${(props) => props.theme.colors.forestGreen};
	height: 32px;
	width: 100%;
	color: ${(props) => props.theme.colors.white};
	text-align: center;
	padding-top: 7px;
	font-size: 1rem;
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

export default AcceptOrRejectDealBox;

import Image from 'next/image';
import styled from 'styled-components';
import { FC, useEffect, useState, useMemo } from 'react';

import Info from 'assets/svg/info.svg';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

import { Status } from 'components/DealStatus';
import QuestionMark from 'components/QuestionMark';
import { FlexDivRowCentered, Tooltip } from 'components/common';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import {
	Container,
	ErrorNote,
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
import { statusToText, swimmingPoolID } from 'constants/pool';
import { TransactionType, TransactionStatus } from 'constants/transactions';

import AcceptOrRejectDealError from '../AcceptOrRejectDealError';

interface AcceptOrRejectDealBoxProps {
	poolId?: string;
	onSubmit: () => void;
	gasLimitEstimate: GasLimitEstimate;
	purchaseCurrency: string | null;
	dealRedemptionData: {
		status: Status;
		maxProRata: string;
		isOpenEligible: boolean;
		purchaseTokenTotalForDeal: number;
		totalAmountAccepted: number;
	};
	input: any;
}

const AcceptOrRejectDealBox: FC<AcceptOrRejectDealBoxProps> = ({
	poolId,
	onSubmit,
	gasLimitEstimate,
	purchaseCurrency,
	dealRedemptionData,
	input: { placeholder, label, maxValue, inputValue, setInputValue, setIsMaxValue },
}: any) => {
	const { walletAddress } = Connector.useContainer();
	const { txState, setGasPrice, txType, setTxType } = TransactionData.useContainer();

	const [showTooltip, setShowTooltip] = useState(false);
	const [showTxModal, setShowTxModal] = useState(false);
	const [isDealAccept, setIsDealAccept] = useState(true);

	const isWithdraw = !isDealAccept;
	const isPoolDisabled = [swimmingPoolID].includes(poolId);
	const isMaxBalanceExceeded = Number(maxValue ?? 0) < Number(inputValue ?? 0);

	const isDisabled: boolean = useMemo(
		() => !walletAddress || !isWithdraw || isPoolDisabled,
		[walletAddress, isWithdraw, isPoolDisabled]
	);

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState, setShowTxModal]);

	const modalContent = useMemo(
		() => ({
			[TransactionType.Accept]: {
				heading: `You are accepting ${inputValue} deal tokens`,
				onSubmit,
			},
			[TransactionType.Withdraw]: {
				heading: `You are withdrawing ${inputValue} ${purchaseCurrency}`,
				onSubmit,
			},
		}),
		[inputValue, onSubmit, purchaseCurrency]
	);

	const handleMaxButtonClick = () => {
		let max = maxValue;

		if (dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw) {
			max = Math.min(Number(max), Number(dealRedemptionData.maxProRata ?? 0));
		}

		if (
			dealRedemptionData?.status === Status.OpenRedemption &&
			dealRedemptionData.isOpenEligible &&
			!isWithdraw
		) {
			max =
				Number(max) >=
				dealRedemptionData?.purchaseTokenTotalForDeal - dealRedemptionData?.totalAmountAccepted
					? dealRedemptionData?.purchaseTokenTotalForDeal - dealRedemptionData?.totalAmountAccepted
					: 0;
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
	};

	return (
		<Container>
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
							<Image src={Info} alt="info icon" />
						</InfoClick>
					</FlexDivRowCentered>
				</RedemptionPeriodTooltip>
			</RedemptionHeader>
			<ContentContainer>
				<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
				<InputContainer>
					<ActionBoxInput
						type="number"
						value={inputValue}
						placeholder={placeholder}
						onChange={(e) => {
							const value = !!e.target.value.length ? parseFloat(e.target.value) : null;
							setIsMaxValue(false);
							setInputValue(value);
						}}
					/>
					{maxValue && (
						<ActionBoxMax
							isProRata={dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw}
							onClick={handleMaxButtonClick}
						>
							{dealRedemptionData?.status === Status.ProRataRedemption && !isWithdraw
								? 'Max Pro Rata'
								: 'Max'}
						</ActionBoxMax>
					)}
				</InputContainer>
				<ActionBoxHeaderWrapper>
					<ActionBoxHeader
						isAcceptOrReject
						isPool={false}
						isSelected={isDealAccept}
						onClick={() => setIsDealAccept(true)}
					>
						<FlexDivCenterRow>
							Accept Deal
							<QuestionMark
								text={`Choose accept to agree to the deal terms with up to the max amount based on your allocation this round`}
							/>
						</FlexDivCenterRow>
					</ActionBoxHeader>
					<ActionBoxHeader
						isAcceptOrReject
						isPool={false}
						isSelected={!isDealAccept}
						isWithdraw={isWithdraw}
						onClick={() => setIsDealAccept(false)}
					>
						<FlexDivCenterRow>
							Withdraw
							<QuestionMark text="Withdraw a portion or all of your capital from the pool and receive your original purchase tokens back" />
						</FlexDivCenterRow>
					</ActionBoxHeader>
				</ActionBoxHeaderWrapper>
			</ContentContainer>
			{poolId !== '0x7e135d4674406ca8f00f632be5c7a570060c0a15' && (
				<ActionButton
					disabled={isDisabled}
					isWithdraw={isWithdraw}
					onClick={() => {
						if (isDealAccept) {
							return setTxType(TransactionType.Accept);
						}
						if (isWithdraw) {
							return setTxType(TransactionType.Withdraw);
						}

						setShowTxModal(true);
					}}
				>
					{isDealAccept ? 'Accept Deal' : 'Withdraw from Pool'}

					{isPoolDisabled && (
						<div>
							<QuestionMark text="Purchasing for this pool has been disabled due to the open period bug on the initial pool factory contracts that has been patched for all new pools moving forward. If you are in this pool we recommend withdrawing at the end of the pool duration. see details here: https://github.com/AelinXYZ/AELIPs/blob/main/content/aelips/aelip-4.md" />
						</div>
					)}
				</ActionButton>
			)}

			<AcceptOrRejectDealError
				inputValue={inputValue}
				isWithdraw={isWithdraw}
				isMaxBalanceExceeded={isMaxBalanceExceeded}
				dealRedemptionData={dealRedemptionData}
			/>

			{isMaxBalanceExceeded && <ErrorNote>Max balance exceeded</ErrorNote>}

			{dealRedemptionData?.status === Status.ProRataRedemption &&
				!isWithdraw &&
				Number(dealRedemptionData.maxProRata ?? 0) < Number(inputValue ?? 0) && (
					<ErrorNote>More than pro rata amount</ErrorNote>
				)}

			{dealRedemptionData?.status === Status.Closed &&
				!isWithdraw &&
				Number(inputValue ?? 0) > 0 && <ErrorNote>Redemption period is closed</ErrorNote>}

			{dealRedemptionData?.status === Status.OpenRedemption &&
				!dealRedemptionData.isOpenEligible &&
				!isWithdraw &&
				Number(inputValue ?? 0) > 0 && (
					<ErrorNote>You are not eligible for open redemption period</ErrorNote>
				)}

			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				// @ts-ignore
				onSubmit={modalContent[txType].onSubmit}
			>
				{
					// @ts-ignore
					modalContent[txType].heading
				}
			</ConfirmTransactionModal>
		</Container>
	);
};

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

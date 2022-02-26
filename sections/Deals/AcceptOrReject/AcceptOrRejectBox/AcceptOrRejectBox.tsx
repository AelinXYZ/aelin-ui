import styled from 'styled-components';
import { FC, useState, useMemo, ChangeEvent } from 'react';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

import Button from 'components/Button';
import { Tab, Tabs } from 'components/Tabs';
import { Status } from 'components/DealStatus';
import { InputGroup } from 'components/Input/InputGroup';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { Container, ContentContainer } from 'sections/shared/common';

import { GasLimitEstimate } from 'constants/networks';
import { TransactionDealType } from 'constants/transactions';

import AcceptOrRejectError from '../AcceptOrRejectError';
import AcceptOrRejectTab from '../AcceptOrRejectTab';

interface AcceptOrRejectDealBoxProps {
	txType: TransactionDealType;
	setTxType: (txType: TransactionDealType) => void;
	onSubmit: () => void;
	inputValue: number | string;
	setInputValue: (val: number | string) => void;
	setIsMaxValue: (val: boolean) => void;
	userPoolBalance: string | null;
	purchaseTokenSymbol: string | null;
	underlyingDealTokenSymbol: string | null;
	gasLimitEstimate: GasLimitEstimate;
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
	purchaseTokenSymbol,
	underlyingDealTokenSymbol,
	gasLimitEstimate,
	dealRedemptionData,
}) => {
	const [dealRedemptionEnded] = useState<boolean>(dealRedemptionData?.status === Status.Closed);

	const { walletAddress } = Connector.useContainer();
	const { setGasPrice } = TransactionData.useContainer();
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

	const modalContent = useMemo(
		() => ({
			[TransactionDealType.AcceptDeal]: {
				heading: `You are accepting ${inputValue} ${purchaseTokenSymbol}`,
				onSubmit,
			},
			[TransactionDealType.Withdraw]: {
				heading: `You are withdrawing ${inputValue} ${purchaseTokenSymbol}`,
				onSubmit,
			},
		}),
		[inputValue, onSubmit, purchaseTokenSymbol]
	);

	const handleMaxButtonClick = () => {
		let maxValue = Number(userPoolBalance);

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
		const value = !!e.target.value.length ? parseFloat(e.target.value) : '';
		setIsMaxValue(false);
		setInputValue(value);
	};

	const isSecondRound = dealRedemptionData?.status === Status.OpenRedemption;
	const isFirstRound = !isSecondRound;

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
				<Tab label="Accept deal" disabled={dealRedemptionEnded}>
					<>
						{isFirstRound && (
							<AcceptOrRejectTab
								title={`Deal allocation round 1`}
								subtitle={`By clicking "accept deal" you are agreeing to the negotiated exchange rate`}
								setTxType={setTxType}
								inputValue={inputValue}
								setShowTxModal={setShowTxModal}
								dealRedemptionEnded={dealRedemptionEnded}
								handleInputChange={handleInputChange}
								userPoolBalance={userPoolBalance}
								handleMaxButtonClick={handleMaxButtonClick}
								dealRedemptionData={dealRedemptionData}
								purchaseTokenSymbol={underlyingDealTokenSymbol}
								isButtonDisabled={isButtonDisabled}
							/>
						)}
						{isSecondRound && (
							<AcceptOrRejectTab
								title={`Deal allocation round 2`}
								subtitle={`If the deal wasn't fully funded, the remaining deal tokens will be sold on a first come, first serve basis`}
								setTxType={setTxType}
								inputValue={inputValue}
								setShowTxModal={setShowTxModal}
								dealRedemptionEnded={dealRedemptionEnded}
								handleInputChange={handleInputChange}
								userPoolBalance={userPoolBalance}
								handleMaxButtonClick={handleMaxButtonClick}
								dealRedemptionData={dealRedemptionData}
								purchaseTokenSymbol={underlyingDealTokenSymbol}
								isButtonDisabled={isButtonDisabled}
							/>
						)}
						<AcceptOrRejectError
							hasAmount={hasAmount}
							isWithdraw={isWithdraw}
							isMaxBalanceExceeded={isMaxBalanceExceeded}
							isProRataAmountExcceded={isProRataAmountExcceded}
							isRedemptionPeriodClosed={isRedemptionPeriodClosed}
							isProRataRedemptionPeriod={isProRataRedemptionPeriod}
							isEligibleForOpenRedemption={isEligibleForOpenRedemption}
						/>
					</>
				</Tab>
				<Tab label="Withdraw">
					<>
						<Container>
							<ContentContainer>
								<Header>Withdraw tokens</Header>
								<p>
									{`If you didn't accept, or only partially accepted the deal you may withdraw your tokens from the pool`}
								</p>
								<InputGroup
									type="number"
									placeholder="0"
									value={inputValue}
									onChange={handleInputChange}
									icon={<div onClick={handleMaxWithdrawButtonClick}>Max</div>}
								/>
								<ActionBoxInputLabel>
									{`Balance ${Number(userPoolBalance ?? 0)} ${purchaseTokenSymbol}`}
								</ActionBoxInputLabel>

								<Button
									variant="primary"
									size="lg"
									fullWidth
									isRounded
									disabled={isButtonDisabled}
									onClick={() => {
										setTxType(TransactionDealType.Withdraw);
										setShowTxModal(true);
									}}
								>
									Withdraw
								</Button>
							</ContentContainer>
						</Container>
						<AcceptOrRejectError
							hasAmount={hasAmount}
							isWithdraw={isWithdraw}
							isMaxBalanceExceeded={isMaxBalanceExceeded}
							isProRataAmountExcceded={isProRataAmountExcceded}
							isRedemptionPeriodClosed={isRedemptionPeriodClosed}
							isProRataRedemptionPeriod={isProRataRedemptionPeriod}
							isEligibleForOpenRedemption={isEligibleForOpenRedemption}
						/>
					</>
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

const ActionBoxInputLabel = styled.p`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1rem;
	margin-top: 7.5px;
	padding-bottom: 4px;
`;

export default AcceptOrRejectDealBox;

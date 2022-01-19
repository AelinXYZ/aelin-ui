import { useMemo, useEffect, useState } from 'react';

import Connector from 'containers/Connector';

import QuestionMark from 'components/QuestionMark';
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
} from './commons';

import { TransactionStatus, TransactionType } from 'constants/transactions';
import { swimmingPoolID } from 'constants/pool';

const actionBoxTypeToTitle = (
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

	return isPrivatePool ? privatePoolText : publicPoolText;
};

const getActionButtonLabel = ({
	allowance,
	amount,
	isPurchaseExpired,
	isPrivatePoolAndNoAllocation,
}: {
	allowance?: string;
	amount: string | number;
	isPurchaseExpired: boolean | undefined;
	isPrivatePoolAndNoAllocation: boolean | undefined;
}) => {
	if (isPrivatePoolAndNoAllocation) {
		return 'No Allocation';
	}

	if (Number(allowance ?? '0') < Number(amount) && !isPurchaseExpired) {
		return 'Approve';
	}

	return isPurchaseExpired ? 'Purchase Expired' : 'Purchase';
};

const PurchaseActionBox = ({
	poolId,
	privatePoolDetails,
	isPurchaseExpired,
	purchaseCurrency,
	allowance,
	transaction: { txType, txState, setTxType, setGasPrice, gasLimitEstimate, onSubmit, onApprove },
	input: { placeholder, label, maxValue, inputValue, setInputValue, setIsMaxValue },
}: any) => {
	const { walletAddress } = Connector.useContainer();
	const [showTxModal, setShowTxModal] = useState(false);

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState, setShowTxModal]);

	const isPoolDisabled = [swimmingPoolID].includes(poolId);
	const isMaxBalanceExceeded = Number(maxValue ?? 0) < Number(inputValue ?? 0);
	const isEmptyInput = inputValue === 0 || inputValue === null;

	const isDisabled: boolean = useMemo(() => {
		return (
			!walletAddress || isPurchaseExpired || isPoolDisabled || isMaxBalanceExceeded || isEmptyInput
		);
	}, [walletAddress, isPurchaseExpired, isPoolDisabled, isMaxBalanceExceeded, isEmptyInput]);

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
		}),
		[inputValue, onApprove, onSubmit, purchaseCurrency]
	);

	const isPrivatePoolAndNoAllocation = useMemo(
		() => privatePoolDetails?.isPrivatePool && !Number(privatePoolDetails?.privatePoolAmount),
		[privatePoolDetails?.isPrivatePool, privatePoolDetails?.privatePoolAmount]
	);

	const handleMaxButtonClick = () => {
		let max = maxValue;

		if (privatePoolDetails?.isPrivatePool) {
			max = Math.min(Number(privatePoolDetails?.privatePoolAmount ?? 0), Number(maxValue));
		}

		setIsMaxValue(true);
		setInputValue(Number(max));
	};

	return (
		<Container>
			<ContentContainer>
				<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
				<InputContainer>
					<ActionBoxInput
						type={'number'}
						placeholder={placeholder}
						value={inputValue}
						onChange={(e) => {
							const value = !!e.target.value.length ? parseFloat(e.target.value) : null;
							setIsMaxValue(false);
							setInputValue(value);
						}}
					/>
					{!!maxValue && (
						<ActionBoxMax isProRata={false} onClick={handleMaxButtonClick}>
							Max
						</ActionBoxMax>
					)}
				</InputContainer>
				<ActionBoxHeaderWrapper>
					<ActionBoxHeader isPool isSelected={false} isAcceptOrReject={false}>
						<FlexDivCenterRow>
							{actionBoxTypeToTitle(
								privatePoolDetails?.isPrivatePool ?? false,
								privatePoolDetails?.privatePoolAmount ?? '0',
								purchaseCurrency
							)}
						</FlexDivCenterRow>
					</ActionBoxHeader>
				</ActionBoxHeaderWrapper>
			</ContentContainer>

			{poolId !== '0x7e135d4674406ca8f00f632be5c7a570060c0a15' && (
				<ActionButton
					disabled={isDisabled}
					isWithdraw={false}
					onClick={() => {
						const setCorrectTxnType = () => {
							if (Number(allowance ?? 0) < Number(inputValue ?? 0)) {
								return setTxType(TransactionType.Allowance);
							}

							return setTxType(TransactionType.Purchase);
						};

						setCorrectTxnType();
						setShowTxModal(true);
					}}
				>
					{getActionButtonLabel({
						allowance,
						amount: inputValue,
						isPurchaseExpired,
						isPrivatePoolAndNoAllocation,
					})}
					{isPoolDisabled && (
						<div>
							<QuestionMark text="Purchasing for this pool has been disabled due to the open period bug on the initial pool factory contracts that has been patched for all new pools moving forward. If you are in this pool we recommend withdrawing at the end of the pool duration. see details here: https://github.com/AelinXYZ/AELIPs/blob/main/content/aelips/aelip-4.md" />
						</div>
					)}
				</ActionButton>
			)}

			{isMaxBalanceExceeded && <ErrorNote>Max balance exceeded</ErrorNote>}

			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={modalContent[txType]?.onSubmit}
			>
				{modalContent[txType]?.heading}
			</ConfirmTransactionModal>
		</Container>
	);
};

export default PurchaseActionBox;

import { FC, useMemo, useState } from 'react';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

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
} from '../../../shared/common';

import { swimmingPoolID } from 'constants/pool';
import { TransactionPurchaseType } from 'constants/transactions';
import { GasLimitEstimate } from 'constants/networks';

import { actionBoxTypeToTitle, getActionButtonLabel } from './helpers';

interface PurchasePoolBoxProps {
	poolId: string;
	txType: TransactionPurchaseType;
	onSubmit: () => void;
	onApprove: () => void;
	inputValue: number | string;
	maxValue: number;
	setInputValue: (val: number | string) => void;
	setIsMaxValue: (val: boolean) => void;
	userPurchaseBalance: string | null;
	purchaseTokenAllowance?: string;
	gasLimitEstimate: GasLimitEstimate;
	isPurchaseExpired: boolean;
	purchaseTokenSymbol: string;
	privatePoolDetails?: { isPrivatePool: boolean; privatePoolAmount: string };
}

const PurchasePoolBox: FC<PurchasePoolBoxProps> = ({
	poolId,
	txType,
	onSubmit,
	onApprove,
	inputValue,
	maxValue,
	setInputValue,
	setIsMaxValue,
	userPurchaseBalance,
	purchaseTokenAllowance,
	gasLimitEstimate,
	isPurchaseExpired,
	purchaseTokenSymbol,
	privatePoolDetails,
}) => {
	const { walletAddress } = Connector.useContainer();
	const { setGasPrice } = TransactionData.useContainer();

	const [showTxModal, setShowTxModal] = useState(false);

	const isPoolDisabled = [swimmingPoolID].includes(poolId);
	const isEmptyInput = inputValue === '' || Number(inputValue) === 0;
	const isMaxBalanceExceeded = Number(userPurchaseBalance ?? 0) < Number(inputValue ?? 0);

	const isButtonDisabled: boolean = useMemo(() => {
		return (
			!walletAddress || isPurchaseExpired || isPoolDisabled || isMaxBalanceExceeded || isEmptyInput
		);
	}, [walletAddress, isPurchaseExpired, isPoolDisabled, isMaxBalanceExceeded, isEmptyInput]);

	const modalContent = useMemo(
		() => ({
			[TransactionPurchaseType.Allowance]: {
				heading: 'Confirm Approval',
				onSubmit: onApprove,
			},
			[TransactionPurchaseType.Purchase]: {
				heading: `You are purchasing ${inputValue} ${purchaseTokenSymbol}`,
				onSubmit,
			},
		}),
		[inputValue, onApprove, onSubmit, purchaseTokenSymbol]
	);

	const isPrivatePoolAndNoAllocation = useMemo(
		() => privatePoolDetails?.isPrivatePool && !Number(privatePoolDetails?.privatePoolAmount),
		[privatePoolDetails?.isPrivatePool, privatePoolDetails?.privatePoolAmount]
	);

	const handleMaxButtonClick = () => {
		let maxVal = maxValue;

		if (privatePoolDetails?.isPrivatePool) {
			maxVal = Math.min(Number(privatePoolDetails?.privatePoolAmount ?? 0), maxValue);
		}

		setIsMaxValue(true);
		setInputValue(maxVal);
	};

	return (
		<Container>
			<ContentContainer>
				<ActionBoxInputLabel>
					{`Balance ${userPurchaseBalance ?? ''} ${purchaseTokenSymbol ?? ''}`}
				</ActionBoxInputLabel>
				<InputContainer>
					<ActionBoxInput
						type="number"
						placeholder="0"
						max={userPurchaseBalance ?? undefined}
						value={inputValue}
						onChange={(e) => {
							const value = !!e.target.value.length ? parseFloat(e.target.value) : '';
							setIsMaxValue(false);
							setInputValue(value);
						}}
					/>
					{!!userPurchaseBalance && (
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
								purchaseTokenSymbol
							)}
						</FlexDivCenterRow>
					</ActionBoxHeader>
				</ActionBoxHeaderWrapper>
			</ContentContainer>

			<ActionButton
				disabled={isButtonDisabled}
				isWithdraw={false}
				onClick={() => {
					setShowTxModal(true);
				}}
			>
				{getActionButtonLabel({
					allowance: purchaseTokenAllowance,
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

			{isMaxBalanceExceeded && <ErrorNote>Max balance exceeded</ErrorNote>}

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

export default PurchasePoolBox;

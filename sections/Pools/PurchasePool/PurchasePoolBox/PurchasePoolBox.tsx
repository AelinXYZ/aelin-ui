import { FC, useMemo, useState } from 'react';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { Container, ContentContainer } from 'sections/shared/common';

import { swimmingPoolID } from 'constants/pool';
import { GasLimitEstimate } from 'constants/networks';
import { TransactionPurchaseType } from 'constants/transactions';

import ApproveBox from './ApproveBox';
import DepositBox from './DepositBox';
import NotAllowedBox from './NotAllowedBox';
import PurchaseEndedBox from './PurchaseEndedBox';

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

	const hasAllowance = Number(purchaseTokenAllowance ?? '0') !== 0;

	const handleMaxButtonClick = () => {
		let maxVal = maxValue;

		if (privatePoolDetails?.isPrivatePool) {
			maxVal = Math.min(Number(privatePoolDetails?.privatePoolAmount ?? 0), maxValue);
		}

		setIsMaxValue(true);
		setInputValue(maxVal);
	};

	const handleButtonClick = () => {
		setShowTxModal(true);
	};

	const isDeposit = hasAllowance && !isPurchaseExpired;
	const isApproved = !hasAllowance && !isPurchaseExpired;
	const isNotAllowed = isPrivatePoolAndNoAllocation && !isPurchaseExpired;

	return (
		<Container>
			<ContentContainer>
				{isNotAllowed && <NotAllowedBox />}

				{isApproved && !isNotAllowed && (
					<ApproveBox
						purchaseToken={purchaseTokenSymbol ?? ''}
						isButtonDisabled={hasAllowance}
						handleClick={handleButtonClick}
					/>
				)}

				{isDeposit && !isApproved && !isNotAllowed && (
					<DepositBox
						placeholder="0"
						inputValue={inputValue}
						setIsMaxValue={setIsMaxValue}
						setInputValue={setInputValue}
						handleClick={handleButtonClick}
						isButtonDisabled={isButtonDisabled}
						purchaseToken={purchaseTokenSymbol ?? ''}
						isMaxBalanceExceeded={isMaxBalanceExceeded}
						handleMaxButtonClick={handleMaxButtonClick}
						tokenBalance={Number(userPurchaseBalance) ?? 0}
						isPrivate={privatePoolDetails?.isPrivatePool ?? false}
						allocation={Number(privatePoolDetails?.privatePoolAmount ?? 0)}
					/>
				)}

				{isPurchaseExpired && <PurchaseEndedBox />}
			</ContentContainer>

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

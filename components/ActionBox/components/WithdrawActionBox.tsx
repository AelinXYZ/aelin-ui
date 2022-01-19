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
	ActionButton,
} from './commons';

import { TransactionStatus, TransactionType } from 'constants/transactions';

const WithdrawActionBox = ({
	purchaseCurrency,
	input: { placeholder, label, maxValue, inputValue, setInputValue, setIsMaxValue },
	transaction: { txType, txState, setTxType, setGasPrice, gasLimitEstimate, onSubmit },
}: any) => {
	const { walletAddress } = Connector.useContainer();
	const [showTxModal, setShowTxModal] = useState(false);

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState, setShowTxModal]);

	const modalContent = useMemo(
		() => ({
			[TransactionType.Withdraw]: {
				heading: `You are withdrawing ${inputValue} ${purchaseCurrency}`,
				onSubmit,
			},
		}),
		[inputValue, onSubmit, purchaseCurrency]
	);

	const isMaxBalanceExceeded = Number(maxValue ?? 0) < Number(inputValue ?? 0);
	const isEmptyInput = inputValue === 0 || inputValue === null;

	const isDisabled: boolean = useMemo(() => {
		return !walletAddress || isMaxBalanceExceeded || isEmptyInput;
	}, [walletAddress, isMaxBalanceExceeded, isEmptyInput]);

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
						<ActionBoxMax
							isProRata={false}
							onClick={() => {
								setIsMaxValue(true);
								setInputValue(Number(maxValue));
							}}
						>
							Max
						</ActionBoxMax>
					)}
				</InputContainer>
			</ContentContainer>

			<ActionButton
				disabled={isDisabled}
				isWithdraw={false}
				onClick={() => {
					setTxType(TransactionType.Withdraw);

					setShowTxModal(true);
				}}
			>
				Withdraw
			</ActionButton>

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

export default WithdrawActionBox;

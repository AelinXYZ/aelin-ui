import { useMemo, useEffect, useState } from 'react';

import Connector from 'containers/Connector';

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
} from '../../../shared/common';

import { TransactionStatus, TransactionType } from 'constants/transactions';

const PoolDurationEndedBox = ({
	purchaseCurrency,
	input: { placeholder, label, maxValue, inputValue, setInputValue, setIsMaxValue },
	transaction: { txType, txState, setTxType, setGasPrice, gasLimitEstimate, onSubmit },
}: any) => {
	const { walletAddress } = Connector.useContainer();
	const [showTxModal, setShowTxModal] = useState(false);

	useEffect(() => {
		if (txState !== TransactionStatus.PRESUBMIT) setShowTxModal(false);
	}, [txState, setShowTxModal]);

	const isEmptyInput = inputValue === 0 || inputValue === null;
	const isMaxBalanceExceeded = Number(maxValue ?? 0) < Number(inputValue ?? 0);

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
				onSubmit={onSubmit}
			>
				{`You are withdrawing ${inputValue} ${purchaseCurrency}`}
			</ConfirmTransactionModal>
		</Container>
	);
};

export default PoolDurationEndedBox;

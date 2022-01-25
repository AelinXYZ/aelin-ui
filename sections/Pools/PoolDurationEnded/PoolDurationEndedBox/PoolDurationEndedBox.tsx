import { FC, useMemo, useEffect, useState } from 'react';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

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
import { GasLimitEstimate } from 'constants/networks';

interface PoolDurationEndedBoxProps {
	onSubmit: () => void;
	inputValue: number | string;
	setInputValue: (value: number | string) => void;
	setIsMaxValue: (value: boolean) => void;
	userPoolBalance: number;
	gasLimitEstimate: GasLimitEstimate;
	purchaseTokenSymbol: string;
}

const PoolDurationEndedBox: FC<PoolDurationEndedBoxProps> = ({
	onSubmit,
	userPoolBalance,
	purchaseTokenSymbol,
	gasLimitEstimate,
	inputValue,
	setInputValue,
	setIsMaxValue,
}: any) => {
	const { walletAddress } = Connector.useContainer();
	const { setGasPrice } = TransactionData.useContainer();

	const [showTxModal, setShowTxModal] = useState(false);
	const isEmptyInput = inputValue === '' || inputValue === 0;
	const isMaxBalanceExceeded = Number(userPoolBalance ?? 0) < Number(inputValue ?? 0);

	const isDisabled: boolean = useMemo(() => {
		return !walletAddress || isMaxBalanceExceeded || isEmptyInput;
	}, [walletAddress, isMaxBalanceExceeded, isEmptyInput]);

	return (
		<Container>
			<ContentContainer>
				<ActionBoxInputLabel>{`Balance ${userPoolBalance} Pool Tokens`}</ActionBoxInputLabel>
				<InputContainer>
					<ActionBoxInput
						type="number"
						placeholder="0"
						value={inputValue}
						onChange={(e) => {
							const value = !!e.target.value.length ? parseFloat(e.target.value) : '';
							setIsMaxValue(false);
							setInputValue(value);
						}}
					/>
					{!!userPoolBalance && (
						<ActionBoxMax
							isProRata={false}
							onClick={() => {
								setIsMaxValue(true);
								setInputValue(Number(userPoolBalance));
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
				{`You are withdrawing ${inputValue} ${purchaseTokenSymbol}`}
			</ConfirmTransactionModal>
		</Container>
	);
};

export default PoolDurationEndedBox;

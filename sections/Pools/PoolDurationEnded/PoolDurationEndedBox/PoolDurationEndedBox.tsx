import { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

import Button from 'components/Button';
import { InputGroup } from 'components/Input/InputGroup';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import {
	Container,
	ErrorNote,
	ContentContainer,
	ActionBoxInputLabel,
	InputContainer,
} from '../../../shared/common';

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

	const isButtonDisabled: boolean = useMemo(() => {
		return !walletAddress || isMaxBalanceExceeded || isEmptyInput;
	}, [walletAddress, isMaxBalanceExceeded, isEmptyInput]);

	return (
		<Container>
			<ContentContainer>
				<Title>Withdraw</Title>

				<InputGroup
					type="number"
					placeholder="0"
					value={inputValue}
					width="100%"
					onChange={(e) => {
						const value = !!e.target.value.length ? parseFloat(e.target.value) : '';
						setIsMaxValue(false);
						setInputValue(value);
					}}
					icon={
						<div
							onClick={() => {
								setIsMaxValue(true);
								setInputValue(Number(userPoolBalance));
							}}
						>
							Max
						</div>
					}
				/>

				{isMaxBalanceExceeded && <ErrorNote>Max balance exceeded</ErrorNote>}

				<ActionBoxInputLabel>{`Balance ${userPoolBalance} ${purchaseTokenSymbol}`}</ActionBoxInputLabel>

				<Button
					variant="primary"
					size="lg"
					isRounded
					fullWidth
					disabled={isButtonDisabled}
					onClick={() => {
						setShowTxModal(true);
					}}
				>
					Withdraw
				</Button>

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
			</ContentContainer>
		</Container>
	);
};

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
`;

export default PoolDurationEndedBox;

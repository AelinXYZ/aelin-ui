import { FC } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';

import {
	InputContainer,
	ActionBoxInput,
	ActionBoxMax,
	ErrorNote,
	ActionBoxInputLabel,
} from 'sections/shared/common';

interface DepositBoxProps {
	placeholder: string;
	inputValue: number | string;
	setIsMaxValue: (val: boolean) => void;
	setInputValue: (val: number | string) => void;
	tokenBalance: number;
	purchaseToken: string;
	handleClick: () => void;
	isButtonDisabled: boolean;
	isMaxBalanceExceeded: boolean;
	handleMaxButtonClick: () => void;
}

const DepositBox: FC<DepositBoxProps> = ({
	placeholder,
	inputValue,
	tokenBalance,
	purchaseToken,
	setIsMaxValue,
	setInputValue,
	handleClick,
	isButtonDisabled,
	isMaxBalanceExceeded,
	handleMaxButtonClick,
}) => {
	return (
		<div>
			<Title>Deposit Tokens</Title>
			<InputContainer>
				<ActionBoxInput
					type={'number'}
					placeholder={placeholder}
					value={inputValue}
					onChange={(e) => {
						const value = !!e.target.value.length ? parseFloat(e.target.value) : '';
						setIsMaxValue(false);
						setInputValue(value);
					}}
				/>
				<ActionBoxMax isProRata={false} onClick={handleMaxButtonClick}>
					Max
				</ActionBoxMax>
				{isMaxBalanceExceeded && <ErrorNote>Max balance exceeded</ErrorNote>}
			</InputContainer>
			<ActionBoxInputLabel>
				Balance: {tokenBalance.toFixed(2)} {purchaseToken}
			</ActionBoxInputLabel>
			<Button
				variant="primary"
				size="lg"
				isRounded
				fullWidth
				disabled={isButtonDisabled}
				onClick={handleClick}
			>
				Deposit
			</Button>
		</div>
	);
};

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
`;

export default DepositBox;

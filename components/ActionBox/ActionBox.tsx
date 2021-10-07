import { FC, MouseEventHandler } from 'react';
import styled from 'styled-components';

interface ActionBoxProps {
	onClick: MouseEventHandler<HTMLButtonElement>;
	header: string;
	inputLable: string;
	actionText: string;
	input: {
		type: string;
		placeholder: string;
		label: string;
	};
}

const ActionBox: FC<ActionBoxProps> = ({
	onClick,
	actionText,
	header,
	input: { type, placeholder, label },
}) => {
	return (
		<Container>
			<ActionBoxHeader>{header}</ActionBoxHeader>
			<InputContainer>
				<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
				<ActionBoxInput type={type} placeholder={placeholder} />
			</InputContainer>
			<PurchaseButton onClick={onClick}>{actionText}</PurchaseButton>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	height: 234px;
	width: 300px;
	position: relative;
	border-radius: 8px;
`;

const ActionBoxHeader = styled.div`
	padding: 15px 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 12px;
`;

const InputContainer = styled.div`
	padding: 15px 20px;
`;

const ActionBoxInputLabel = styled.div`
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 11px;
	padding-bottom: 4px;
`;

const ActionBoxInput = styled.input`
	outline: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 260px;
	background-color: ${(props) => props.theme.colors.background};
	border-radius: 4px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 6px 12px;
	&::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		font-size: 12px;
	}
`;

const PurchaseButton = styled.button`
	width: 100%;
	height: 56px;
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	position: absolute;
	bottom: 0;
	border-radius: 0 0 8px 8px;
	border: none;
`;

export default ActionBox;

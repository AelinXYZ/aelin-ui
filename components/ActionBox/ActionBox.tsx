import { FC, useState, MouseEventHandler } from 'react';
import styled from 'styled-components';
import BaseModal from '../BaseModal';

interface ActionBoxProps {
	onClick: MouseEventHandler<HTMLButtonElement>;
	header: string;
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
	const [showTxModal, setShowTxModal] = useState(false);

	return (
		<Container>
			<ActionBoxHeader>{header}</ActionBoxHeader>
			<InputContainer>
				<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
				<InnerInputContainer>
					<ActionBoxInput type={type} placeholder={placeholder} />
					<ActionBoxMax onClick={() => console.log('max balance')}>Max</ActionBoxMax>
				</InnerInputContainer>
			</InputContainer>
			<PurchaseButton
				onClick={(e) => {
					onClick(e);
					setShowTxModal(true);
				}}
			>
				{actionText}
			</PurchaseButton>
			<BaseModal title="test" setIsModalOpen={setShowTxModal} isModalOpen={showTxModal}>
				<>Hello</>
			</BaseModal>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	height: 234px;
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const ActionBoxHeader = styled.div`
	padding: 15px 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 12px;
`;

const InnerInputContainer = styled.div`
	position: relative;
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

const ActionBoxMax = styled.div`
	position: absolute;
	width: 33px;
	height: 21px;
	left: 215px;
	text-align: center;
	padding-top: 4px;
	padding-left: 2px;
	top: 7px;
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 11px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 100px;
	&:hover {
		cursor: pointer;
	}
`;

const PurchaseButton = styled.button`
	cursor: pointer;
	width: 100%;
	height: 56px;
	background-color: transparent;
	border: none;
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	color: ${(props) => props.theme.colors.black};
	&:hover {
		background-color: ${(props) => props.theme.colors.forestGreen};
		color: ${(props) => props.theme.colors.white};
	}
	position: absolute;
	bottom: 0;
	border-radius: 0 0 8px 8px;
`;

export default ActionBox;

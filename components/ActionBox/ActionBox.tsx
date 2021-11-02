import { FC, useState, MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';
import BaseModal from '../BaseModal';
import { FlexDivRow } from '../common';

interface ActionBoxProps {
	onPurchase?: MouseEventHandler<HTMLButtonElement>;
	onAccept?: MouseEventHandler<HTMLButtonElement>;
	onWithdraw?: MouseEventHandler<HTMLButtonElement>;
	input: {
		type: string;
		placeholder: string;
		label: string;
	};
	isPool: boolean;
}

const ActionBox: FC<ActionBoxProps> = ({
	onPurchase,
	onAccept,
	onWithdraw,
	input: { type, placeholder, label },
	isPool,
}) => {
	const [isDealAccept, setIsDealAccept] = useState(false);
	const [showTxModal, setShowTxModal] = useState(false);

	return (
		<Container>
			<FlexDivRow>
				<ActionBoxHeader onClick={() => setIsDealAccept(true)} isPool={isPool}>
					{isPool ? 'Purchase' : 'Accept Deal'}
				</ActionBoxHeader>
				{!isPool ? (
					<ActionBoxHeader onClick={() => setIsDealAccept(false)} isWithdraw={true} isPool={false}>
						Withdraw
					</ActionBoxHeader>
				) : null}
			</FlexDivRow>
			<InputContainer>
				<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
				<InnerInputContainer>
					<ActionBoxInput type={type} placeholder={placeholder} />
					<ActionBoxMax onClick={() => console.log('max balance')}>Max</ActionBoxMax>
				</InnerInputContainer>
			</InputContainer>
			<ActionButton
				isWithdraw={!isPool && !isDealAccept}
				onClick={(e) => {
					if (isPool && onPurchase && typeof onPurchase === 'function') {
						onPurchase(e);
					} else if (!isPool && isDealAccept && onAccept && typeof onAccept === 'function') {
						onAccept(e);
					} else if (!isPool && !isDealAccept && onWithdraw && typeof onWithdraw === 'function') {
						onWithdraw(e);
					}
					setShowTxModal(true);
				}}
			>
				{isPool ? 'Purchase' : isDealAccept ? 'Accept Deal' : 'Withdraw from Pool'}
			</ActionButton>
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

const ActionBoxHeader = styled.div<{ isPool: boolean; isWithdraw?: boolean }>`
	padding: 15px 20px;
	color: ${(props) =>
		props.isWithdraw ? props.theme.colors.statusRed : props.theme.colors.headerGreen};
	font-size: 12px;
	${(props) =>
		!props.isPool &&
		css`
			&:hover {
				cursor: pointer;
			}
		`}
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

const ActionButton = styled.button<{ isWithdraw: boolean }>`
	cursor: pointer;
	width: 100%;
	height: 56px;
	background-color: transparent;
	border: none;
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	color: ${(props) => props.theme.colors.black};
	&:hover {
		background-color: ${(props) =>
			props.isWithdraw ? props.theme.colors.statusRed : props.theme.colors.forestGreen};
		color: ${(props) => props.theme.colors.white};
	}
	position: absolute;
	bottom: 0;
	border-radius: 0 0 8px 8px;
`;

export default ActionBox;

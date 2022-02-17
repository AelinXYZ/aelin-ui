import { FC } from 'react';
import styled from 'styled-components';
import { wei } from '@synthetixio/wei';

import Button from 'components/Button';
import { FlexDivColCentered } from 'components/common';

interface TabContentProps {
	balance: any;
	label: string;
	action: string;
	isApproved: boolean;
	placeholder: string;
	inputValue: number;
	setIsMaxValue: Function;
	setInputValue: Function;
	setShowTxModal: Function;
	isApproveButtonDisabled: boolean;
	isActionButtonDisabled: boolean;
}

const TabContent: FC<TabContentProps> = ({
	balance,
	label,
	action,
	isApproved,
	placeholder,
	inputValue,
	setIsMaxValue,
	setInputValue,
	setShowTxModal,
	isApproveButtonDisabled,
	isActionButtonDisabled,
}) => {
	return (
		<ContentContainer>
			<InputContainer>
				<ActionBoxInput
					type={'number'}
					placeholder={placeholder}
					value={inputValue}
					onChange={(e) => {
						setIsMaxValue(false);
						setInputValue(parseFloat(e.target.value));
					}}
				/>
				<ActionBoxMax
					onClick={() => {
						if (balance?.gt(wei(0))) {
							setInputValue(balance?.toNumber());
							setIsMaxValue(true);
						}
					}}
				>
					Max
				</ActionBoxMax>
				{balance?.toNumber() < inputValue && <ErrorNote>Max balance exceeded</ErrorNote>}
			</InputContainer>
			<ActionBoxInputLabel>{label}</ActionBoxInputLabel>
			<Buttons>
				<Button
					variant="primary"
					fullWidth
					isRounded
					disabled={isApproveButtonDisabled}
					onClick={() => setShowTxModal(true)}
				>
					Approve
				</Button>
				<Button
					variant="primary"
					fullWidth
					isRounded
					disabled={isActionButtonDisabled}
					onClick={() => setShowTxModal(true)}
				>
					{action}
				</Button>
			</Buttons>
		</ContentContainer>
	);
};

const ContentContainer = styled.div`
	padding-top: 30px;
`;

const InputContainer = styled.div`
	position: relative;
`;

const ActionBoxInput = styled.input`
	outline: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
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

const ActionBoxInputLabel = styled.p`
	color: ${(props) => props.theme.colors.forestGreen};
	font-size: 1.2rem;
	padding-bottom: 4px;
`;

const ActionBoxMax = styled.div`
	position: absolute;
	height: 21px;
	left: 180px;
	text-align: center;
	padding: 4px 6px 4px 4px;
	top: 50%;
	transform: translateY(-50%);
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 11px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 100px;
	&:hover {
		cursor: pointer;
	}
`;

const ErrorNote = styled.div`
	position: absolute;
	bottom: -18px;
	left: 0;
	color: ${(props) => props.theme.colors.statusRed};
	font-size: 12px;
	font-weight: bold;
`;

const Buttons = styled(FlexDivColCentered)`
	margin: 5px 0;
	width: 100%;
	gap: 1rem;
`;

export default TabContent;

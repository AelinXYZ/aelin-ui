import { FC } from 'react';
import styled from 'styled-components';
import Wei, { wei } from '@synthetixio/wei';

import Button from 'components/Button';
import { FlexDivColCentered } from 'components/common';
import { InputGroup } from 'components/Input/InputGroup';

interface TabContentProps {
	balance: Wei;
	label: string;
	action: string;
	placeholder: string;
	inputValue: number | string;
	setIsMaxValue: (isMaxValue: boolean) => void;
	setInputValue: (inputValue: number | string) => void;
	setShowTxModal: (showTxModal: boolean) => void;
	isApproveButtonDisabled: boolean;
	isActionButtonDisabled: boolean;
}

const TabContent: FC<TabContentProps> = ({
	balance,
	label,
	action,
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
				<InputGroup
					type={'number'}
					placeholder={placeholder}
					value={inputValue}
					onChange={(e) => {
						const value = !!e.target.value.length ? parseFloat(e.target.value) : '';
						setIsMaxValue(false);
						setInputValue(value);
					}}
					icon={
						<div
							onClick={() => {
								if (balance?.gt(wei(0))) {
									setInputValue(balance?.toNumber());
									setIsMaxValue(true);
								}
							}}
						>
							Max
						</div>
					}
				/>
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
	padding-top: 26px;
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
	border: 1px solid ${(props) => props.theme.colors.tableBorders};
	height: 35px;
	padding: 6px 12px;
	&::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		font-size: 12px;
	}
`;

const ActionBoxInputLabel = styled.p`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	padding-bottom: 4px;
`;

const ErrorNote = styled.div`
	color: ${(props) => props.theme.colors.textRequired};
	position: absolute;
	margin-top: 2px;
	font-size: 0.8rem;
	font-weight: bold;
`;

const Buttons = styled(FlexDivColCentered)`
	margin: 5px 0;
	width: 100%;
	gap: 1rem;
`;

export default TabContent;

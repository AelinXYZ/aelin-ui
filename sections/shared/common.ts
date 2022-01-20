import styled, { css } from 'styled-components';

import Button from 'components/Button';

import { FlexDivRow } from 'components/common';

export const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	min-height: 250px;
	min-width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

export const ErrorNote = styled.div`
	color: ${(props) => props.theme.colors.statusRed};
	padding-left: 20px;
	font-size: 1rem;
	font-weight: bold;
`;

export const ContentContainer = styled.div`
	padding: 15px 20px;
`;

export const ActionBoxInputLabel = styled.div`
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 1rem;
	padding-bottom: 4px;
`;

export const InputContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const ActionBoxInput = styled.input`
	outline: none;
	width: 150px;
	background-color: ${(props) => props.theme.colors.background};
	border-radius: 4px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 6px 12px;
	&::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		font-size: 1rem;
	}
`;

export const ActionBoxMax = styled.div<{ isProRata: boolean }>`
	width: ${(props) => (props.isProRata ? '105px' : '42px')};
	left: ${(props) => (props.isProRata ? '185px' : '210px')};
	text-align: center;
	padding: 2px 6px;
	top: 7px;
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 1rem;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 100px;
	&:hover {
		cursor: pointer;
	}
`;

export const ActionBoxHeaderWrapper = styled(FlexDivRow)`
	margin-top: 20px;
`;

export const FlexDivCenterRow = styled(FlexDivRow)`
	align-items: center;
`;

export const ActionBoxHeader = styled(Button)<{
	isAcceptOrReject: boolean;
	isPool: boolean;
	isSelected: boolean;
	isWithdraw?: boolean;
}>`
	margin: 5px;
	color: ${(props) =>
		props.isWithdraw ? props.theme.colors.statusRed : props.theme.colors.headerGreen};
	font-size: 1rem;

	${(props) =>
		props.isSelected &&
		css`
			background-color: ${props.theme.colors.grey};
		`}

	${(props) =>
		!props.isPool &&
		css`
			&:hover {
				cursor: pointer;
			}
		`}

	${(props) =>
		!props.isAcceptOrReject &&
		css`
			padding: 4px;
			background: transparent;
			cursor: default;
			text-align: start;
		`}
`;

export const ActionButton = styled.button<{ isWithdraw: boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	width: 100%;
	height: 56px;
	border: none;
	font-size: 1.2rem;
	background-color: transparent;
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	${(props) => {
		if (props.disabled) {
			return `color: ${props.theme.colors.textGrey};`;
		}
		return `
  color: ${props.theme.colors.black};
  &:hover {
    background-color: ${
			props.isWithdraw ? props.theme.colors.statusRed : props.theme.colors.forestGreen
		};
    color: ${props.theme.colors.white};
  }
  `;
	}}

	position: absolute;
	bottom: 0;
	border-radius: 0 0 8px 8px;
`;

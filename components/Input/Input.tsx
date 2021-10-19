import styled, { css } from 'styled-components';

export const inputCSS = css`
	width: 100%;
	min-width: 0;
	font-family: ${(props) => props.theme.fonts.agrandir};
	background-color: ${(props) => props.theme.colors.background};
	height: 32px;
	padding: 0 8px;
	font-size: 14px;
	border: 0;
	border-radius: 4px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	color: ${(props) => props.theme.colors.black};
	::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		color: ${(props) => props.theme.colors.forestGreen};
	}
	&:focus {
		outline: none;
		cursor: text;
		box-shadow: 0px 0px 2px ${(props) => props.theme.colors.forestGreen};
	}
	caret-color: ${(props) => props.theme.colors.grey};
	outline: none;
`;

export const Input = styled.input`
	${inputCSS};
`;

export default Input;

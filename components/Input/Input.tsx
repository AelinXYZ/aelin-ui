import styled from 'styled-components';

export const Input = styled.input<{ width?: string }>`
	width: ${(props) => props.width || '100%'};
	min-width: 0;
	margin-right: 8px;
	font-family: ${(props) => props.theme.fonts.agrandir};
	background-color: ${(props) => props.theme.colors.inputBackground};
	height: 32px;
	padding: 0 8px;
	font-size: 1rem;
	border: 0;
	border-radius: 4px;
	border: 1px solid ${(props) => props.theme.colors.grey4};
	color: ${(props) => props.theme.colors.textSmall};
	::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		color: ${(props) => props.theme.colors.textBody};
	}
	&:focus {
		box-shadow: 0px 0px 2px ${(props) => props.theme.colors.borders};
	}
	caret-color: ${(props) => props.theme.colors.primary};
	outline: none;
`;

export default Input;

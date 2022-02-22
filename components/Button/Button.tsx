import styled, { css } from 'styled-components';
import { resetButtonCSS } from 'components/common';

type ButtonProps = {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	variant?: 'primary' | 'secondary' | 'tertiary' | 'black';
	isActive?: boolean;
	isRounded?: boolean;
	fullWidth?: boolean;
};

const Button = styled.button<ButtonProps>`
	height: 32px;
	line-height: 32px;
	font-size: 1rem;
	border: none;
	border-radius: ${(props) => (props.isRounded ? '100px' : '4px')};

	white-space: nowrap;
	cursor: pointer;
	outline: none;
	padding: 0 24px;
	color: ${(props) => props.theme.colors.white};
	text-transform: capitalize;

	${(props) =>
		props.fullWidth &&
		css`
			display: block;
			width: 100%;
		`}

	${(props) =>
		props.size === 'sm' &&
		css`
			height: 24px;
			line-height: 24px;
		`}

	${(props) =>
		props.size === 'md' &&
		css`
			height: 32px;
			line-height: 32px;
		`}

	${(props) =>
		props.size === 'lg' &&
		css`
			height: 40px;
			line-height: 40px;
		`}


	${(props) =>
		props.size === 'xl' &&
		css`
			height: 48px;
			line-height: 48px;
		`}

	${(props) =>
		props.variant === 'primary' &&
		css`
			color: ${(props) => props.theme.colors.textButton};
			background: ${(props) => props.theme.colors.buttonPrimary};

			&:hover {
				&:not(:disabled) {
					box-shadow: 0px 0px 10px rgba(63, 121, 35, 0.5);
				}
			}

			&:disabled {
				opacity: 0.5;
				box-shadow: none;
				cursor: not-allowed;
			}
		`}

		${(props) =>
		props.variant === 'secondary' &&
		css`
			background: ${(props) => props.theme.colors.buttonSecondary};
			border: 1px solid ${(props) => props.theme.colors.inputBorders};
			color: ${(props) => props.theme.colors.textSecondaryButton};

			&:hover {
				&:not(:disabled) {
					box-shadow: 0px 0px 10px rgba(63, 121, 35, 0.5);
				}
			}

			&:disabled {
				opacity: 0.5;
				box-shadow: none;
				cursor: not-allowed;
			}
		`}

		${(props) =>
		props.variant === 'tertiary' &&
		css`
			${resetButtonCSS};
			color: ${(props) => props.theme.colors.primary};

			&:hover {
				&:not(:disabled) {
					color: ${(props) => props.theme.colors.primary};
				}
			}
		`}

		${(props) =>
		props.variant === 'black' &&
		css`
			background: ${(props) => props.theme.colors.black};
			color: ${(props) => props.theme.colors.white};

			&:hover {
				&:not(:disabled) {
					box-shadow: 0px 0px 10px rgba(46, 46, 46, 0.5);
				}
			}

			&:disabled {
				opacity: 0.5;
				box-shadow: none;
				cursor: not-allowed;
			}
		`}
`;

export default Button;

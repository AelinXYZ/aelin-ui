import styled, { css } from 'styled-components';
import { resetButtonCSS } from 'components/common';

type ButtonProps = {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	variant?: 'primary' | 'secondary' | 'tertiary';
	isActive?: boolean;
	isRounded?: boolean;
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
	color: ${(props) => props.theme.colors.white};
	text-transform: capitalize;

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
			color: ${(props) => props.theme.colors.white};
			background: ${(props) => props.theme.colors.forestGreen};

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
			background: transparent;
			border: 1px solid ${(props) => props.theme.colors.forestGreen};
			color: ${(props) => props.theme.colors.forestGreen};

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
			color: ${(props) => props.theme.colors.forestGreen};

			&:hover {
				&:not(:disabled) {
					color: ${(props) => props.theme.colors.forestGreen};
				}
			}
		`}
`;

export default Button;

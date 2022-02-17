import { FC, useRef } from 'react';
import styled, { css } from 'styled-components';
import Input from './Input';

interface IInputGroup extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'width'> {
	icon?: JSX.Element;
	width?: string;
	iconPosition?: 'right' | 'left';
}

interface IInputWrapper {
	iconSize?: number;
	iconPosition: 'right' | 'left';
}

export const InputGroup: FC<IInputGroup> = ({ icon, iconPosition = 'right', ...rest }) => {
	const iconRef = useRef<HTMLInputElement>();

	return (
		<InputWrapper
			className="inputGroup"
			iconPosition={iconPosition}
			iconSize={iconRef?.current?.getBoundingClientRect()?.width}
		>
			<StyledInput {...rest} />
			<StyledIcon ref={iconRef as any}>{icon}</StyledIcon>
		</InputWrapper>
	);
};

const StyledInput = styled(Input)``;

const StyledIcon = styled.div``;

const InputWrapper = styled.div<IInputWrapper>`
	position: relative;
	& > ${StyledIcon} {
		position: absolute;
		display: flex;
		${(props) =>
			props.iconPosition === 'right'
				? css`
						right: 0;
				  `
				: css`
						left: 0;
				  `}
		top: 0;
		height: 32px;
		align-items: center;
		justify-content: center;
		padding: 5px 10px 5px 10px;
		cursor: pointer;
		color: ${(props) => props.theme.colors.headerGrey};
		font-size: 14px;
		font-family: ${(props) => props.theme.fonts.agrandir};
	}

	& > ${StyledInput} {
		padding-right: ${(props) => (props.iconPosition === 'right' ? `${props.iconSize}px` : '8px')};
		padding-left: ${(props) => (props.iconPosition === 'left' ? `${props.iconSize}px` : '8px')};
	}

	&.inputGroup {
		position: relative;
	}
`;

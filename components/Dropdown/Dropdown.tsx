import { useState, FC, ReactNode } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled, { css } from 'styled-components';
import Image from 'next/image';

import { zIndex } from 'constants/ui';
import { FlexDivColCentered, FlexDiv } from 'components/common';

import CaretDownWhite from 'assets/svg/caret-down-white.svg';
import CaretDownBlack from 'assets/svg/caret-down-black.svg';
import UI from 'containers/UI';
import { ThemeMode } from 'styles/theme';

type DropdownProps = {
	children: ReactNode;
	content: ReactNode;
	isOpen: boolean;
	setIsOpen: Function;
	isEnabled?: boolean;
	hideArrow?: boolean;
};

const Dropdown: FC<DropdownProps> = ({
	children,
	content,
	isOpen,
	setIsOpen,
	isEnabled = true,
	hideArrow = false,
}) => {
	const { theme } = UI.useContainer();
	return (
		<Container isEnabled={isEnabled} onClick={() => setIsOpen(!isOpen)}>
			<OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
				<StyledFlexDiv>
					<Inner>{children}</Inner>
					{!hideArrow && (
						<StyledImage
							src={theme === ThemeMode.LIGHT ? CaretDownBlack : CaretDownWhite}
							alt="caret down"
						/>
					)}
				</StyledFlexDiv>
				{isOpen && <Content>{content}</Content>}
			</OutsideClickHandler>
		</Container>
	);
};

const Container = styled.div<{ isEnabled: boolean }>`
	height: 100%;
	position: relative;
	display: flex;
	align-items: center;
	${(props) =>
		!props.isEnabled &&
		css`
			pointer-events: none;
		`}
`;

const Inner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 8px;
	cursor: pointer;
`;

const Content = styled(FlexDivColCentered)`
	background: ${(props) => props.theme.colors.headerPrimary};
	border: 1px solid ${(props) => props.theme.colors.inputBorders};
	border-radius: 4px;
	position: absolute;
	top: 80%;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	min-width: 150px;
	z-index: 100;
`;

const StyledFlexDiv = styled(FlexDiv)`
	padding: 0 8px;
`;

const StyledImage = styled(Image)`
	height: 12px;
	width: 12px;
`;
export default Dropdown;

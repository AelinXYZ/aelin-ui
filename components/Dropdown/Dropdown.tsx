import { useState, FC, ReactNode } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled, { css } from 'styled-components';

import { zIndex } from 'constants/ui';
import { FlexDivColCentered } from 'components/common';

type DropdownProps = {
	children: ReactNode;
	content: ReactNode;
	isModalOpen: boolean;
	setIsModalOpen: Function;
	isEnabled?: boolean;
};

const Dropdown: FC<DropdownProps> = ({
	children,
	content,
	isModalOpen,
	setIsModalOpen,
	isEnabled = true,
}) => {
	return (
		<Container isEnabled={isEnabled} onClick={() => setIsModalOpen(!isModalOpen)}>
			<OutsideClickHandler onOutsideClick={() => setIsModalOpen(false)}>
				<Inner>{children}</Inner>
				{isModalOpen && <Content>{content}</Content>}
			</OutsideClickHandler>
		</Container>
	);
};

const Container = styled.div<{ isEnabled: boolean }>`
	width: 160px;
	height: 32px;
	position: relative;

	> div {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		z-index: ${zIndex.DROPDOWN};
		width: inherit;
	}
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
	width: 160px;
	background-color: ${(props) => props.theme.colors.grey};
	border-radius: 50px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 12px 30px;
	cursor: pointer;
`;

const Content = styled(FlexDivColCentered)`
	margin-top: 12px;
	background: ${(props) => props.theme.colors.grey};
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 4px;
`;

export default Dropdown;

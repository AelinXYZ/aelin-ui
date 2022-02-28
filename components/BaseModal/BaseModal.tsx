import { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Image from 'next/image';
import OutsideClickHandler from 'react-outside-click-handler';

import CloseIcon from 'assets/svg/menu-close.svg';

interface BaseModalProps {
	isModalOpen: boolean;
	children: React.ReactChildren | React.ReactNode | JSX.Element;
	title: string;
	setIsModalOpen: (isOpen: boolean) => void;
	onClose?: () => void;
}

const BaseModal: FC<BaseModalProps> = ({
	isModalOpen,
	setIsModalOpen,
	children,
	title,
	onClose,
}) => {
	const [isBrowser, setIsBrowser] = useState(false);

	useEffect(() => {
		setIsBrowser(true);
	}, []);

	const modalContent = isModalOpen ? (
		<StyledModalOverlay>
			<OutsideClickHandler
				onOutsideClick={() => {
					if (onClose != null) {
						onClose();
					}
					setIsModalOpen(false);
				}}
			>
				<StyledModal>
					<StyledModalHeader>
						<StyledTitle>{title ?? ''}</StyledTitle>
						<StyledCloseIcon
							href="#"
							onClick={() => {
								if (onClose != null) {
									onClose();
								}
								setIsModalOpen(false);
							}}
						>
							<Image src={CloseIcon} alt="close" />
						</StyledCloseIcon>
					</StyledModalHeader>
					<StyledModalBody>{children}</StyledModalBody>
				</StyledModal>
			</OutsideClickHandler>
		</StyledModalOverlay>
	) : null;

	if (isBrowser) {
		return ReactDOM.createPortal(modalContent, document.getElementById('modal-root') as Element);
	} else {
		return null;
	}
};

const StyledModalBody = styled.div`
	padding-top: 10px;
`;

const StyledModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	font-size: 2rem;
`;

const StyledTitle = styled.div`
	width: 100%;
	text-align: center;
	padding-top: 10px;
	font-size: 1.6rem;
	font-weight: bold;
	color: ${(props) => props.theme.colors.heading};
`;

const StyledModal = styled.div`
	background: ${(props) => props.theme.colors.boxesBackground};
	min-width: 500px;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.borders};
	padding: 23px;
`;

const StyledModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
`;

const StyledCloseIcon = styled.a`
	position: absolute;
	display: flex;
	top: 12px;
	right: 12px;
`;

export default BaseModal;

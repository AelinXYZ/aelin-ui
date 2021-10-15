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
}

const BaseModal: FC<BaseModalProps> = ({ isModalOpen, setIsModalOpen, children, title }) => {
	const [isBrowser, setIsBrowser] = useState(false);

	useEffect(() => {
		setIsBrowser(true);
	}, []);

	const modalContent = isModalOpen ? (
		<StyledModalOverlay>
			<OutsideClickHandler onOutsideClick={() => setIsModalOpen(false)}>
				<StyledModal>
					<StyledModalHeader>
						<a href="#" onClick={() => setIsModalOpen(false)}>
							<Image src={CloseIcon} alt="close" />
						</a>
					</StyledModalHeader>
					{title && <div>{title}</div>}
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
	justify-content: flex-end;
	font-size: 25px;
`;

const StyledModal = styled.div`
	background: ${(props) => props.theme.colors.modalBackground};
	width: 500px;
	height: 400px;
	border-radius: 8px;
	padding: 15px;
`;
const StyledModalOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
`;

export default BaseModal;

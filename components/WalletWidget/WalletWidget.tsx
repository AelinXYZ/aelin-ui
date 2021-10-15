import { FC, useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { truncateAddress } from 'utils/crypto';
import Connector from 'containers/Connector';
import { FlexDivCentered, FlexDiv, FlexDivColCentered } from 'components/common';
import { zIndex } from 'constants/ui';

import DesktopWalletModal from './WalletModal';

const WalletWidget: FC = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const { walletAddress } = Connector.useContainer();
	return (
		<DropdownContainer onClick={() => setIsModalOpen(!isModalOpen)}>
			<OutsideClickHandler onOutsideClick={() => setIsModalOpen(false)}>
				{walletAddress == null ? (
					<Container>
						<Dot isActive={false} />
						<Address>Connect</Address>
					</Container>
				) : (
					<>
						<Container>
							<Dot isActive={true} />
							<Address>{truncateAddress(walletAddress)}</Address>
						</Container>
					</>
				)}
				{isModalOpen && (
					<DesktopStyledMenuModal>
						<DesktopWalletModal onDismiss={() => setIsModalOpen(false)} />
					</DesktopStyledMenuModal>
				)}
			</OutsideClickHandler>
		</DropdownContainer>
	);
};

const DesktopStyledMenuModal = styled(FlexDivColCentered)`
	margin-top: 12px;
	background: ${(props) => props.theme.colors.grey};
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 4px;
`;

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 160px;
	background-color: ${(props) => props.theme.colors.grey};
	border-radius: 100px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 12px 30px;
	cursor: pointer;
`;

const DropdownContainer = styled.div`
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
`;

const Dot = styled.div<{ isActive: boolean }>`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: ${(props) =>
		props.isActive ? props.theme.colors.success : props.theme.colors.error};
`;

const Address = styled.div`
	font-size: 12px;
	margin-top: 2px;
	margin-left: 10px;
`;

export default WalletWidget;

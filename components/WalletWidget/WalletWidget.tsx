import { FC, useState } from 'react';
import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import { truncateAddress } from 'utils/crypto';
import Connector from 'containers/Connector';

import DesktopWalletModal from './WalletModal';
import Button from 'components/Button';
import { FlexDivCenterRow } from 'sections/shared/common';
import { FlexDiv, FlexDivCentered } from 'components/common';

const WalletWidget: FC = () => {
	const { walletAddress, connectWallet } = Connector.useContainer();
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	return (
		<Dropdown
			isOpen={isDropdownOpen}
			setIsOpen={setIsDropdownOpen}
			content={<DesktopWalletModal onDismiss={() => setIsDropdownOpen(false)} />}
			hideArrow={!walletAddress}
		>
			<FlexDivCentered>
				{!!walletAddress ? (
					<>
						<Dot isActive={!!walletAddress} />
						<Address>{!!walletAddress ? truncateAddress(walletAddress ?? '') : 'Connect'}</Address>
					</>
				) : (
					<StyledButton
						fullWidth
						isRounded
						size="lg"
						variant="secondary"
						onClick={(e) => {
							e.stopPropagation();
							connectWallet();
						}}
					>
						Connect wallet
					</StyledButton>
				)}
			</FlexDivCentered>
		</Dropdown>
	);
};

const StyledButton = styled(Button)`
	display: flex;
	align-items: center;
	height: 32px;
	background: ${(props) => props.theme.colors.buttonSecondary};
	color: ${(props) => props.theme.colors.textBody};
	border-color: ${(props) => props.theme.colors.inputBorders};
	font-size: 0.8rem;
	font-family: ${(props) => props.theme.fonts.agrandir};
	&:hover {
		box-shadow: none !important;
	}
`;

const StyledFlexDiv = styled(FlexDiv)`
	height: 100%;
	align-items: center;
`;

const Dot = styled.div<{ isActive: boolean }>`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	margin-right: 8px;
	background-color: ${(props) => (props.isActive ? props.theme.colors.green3 : 'transparent')};
`;

const Address = styled.div``;

export default WalletWidget;

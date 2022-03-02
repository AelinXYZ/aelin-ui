import { FC, useState } from 'react';
import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import { truncateAddress } from 'utils/crypto';
import Connector from 'containers/Connector';

import DesktopWalletModal from './WalletModal';
import Button from 'components/Button';
import { FlexDiv, FlexDivCentered, FlexDivColCentered } from 'components/common';
import { getWalletIcon } from './WalletModal';
import { FlexDivCenterRow } from 'sections/shared/common';

const WalletWidget: FC = () => {
	const { walletAddress, connectWallet, selectedWallet } = Connector.useContainer();
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
					<FlexDivCenterRow>
						<WalletIcon>{getWalletIcon(selectedWallet?.toLocaleLowerCase())}</WalletIcon>
						<Address>{!!walletAddress ? truncateAddress(walletAddress ?? '') : 'Connect'}</Address>
					</FlexDivCenterRow>
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

const WalletIcon = styled.div`
	width: 20px;
	height: 20px;
	margin-right: 6px;
`;

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

const Address = styled.div``;

export default WalletWidget;

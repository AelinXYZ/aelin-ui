//@ts-nocheck
import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { ExternalLink, FlexDiv, FlexDivCol, FlexDivCentered } from 'components/common';
import Button from 'components/Button';
import CopyToClipboard from 'components/CopyToClipboard';

import BrowserWalletIcon from 'assets/wallet-icons/browserWallet.svg';
import WalletConnectIcon from 'assets/wallet-icons/walletConnect.svg';
import CoinbaseIcon from 'assets/wallet-icons/coinbase.svg';
import GnosisIcon from 'assets/wallet-icons/gnosis.svg';
import LinkIconWhite from 'assets/svg/link-white.svg';
import LinkIconBlack from 'assets/svg/link-black.svg';

import Connector from 'containers/Connector';
import Etherscan from 'containers/BlockExplorer';
import { truncateAddress } from 'utils/crypto';
import UI from 'containers/UI';
import { ThemeMode } from 'styles/theme';

export const getWalletIcon = (selectedWallet?: string | null) => {
	switch (selectedWallet) {
		case 'browser wallet':
			return <Image src={BrowserWalletIcon} alt="browser-wallet" />;
		case 'walletconnect':
			return <Image src={WalletConnectIcon} alt="wallet-connect" />;
		case 'coinbase wallet':
		case 'walletlink':
			return <Image src={CoinbaseIcon} alt="coinbase-wallet" />;
		case 'gnosis':
			return <Image src={GnosisIcon} alt="gnosis-wallet" />;
		default:
			return selectedWallet;
	}
};

interface WalletModalProps {
	onDismiss: () => void;
}

const WalletModal: FC<WalletModalProps> = ({ onDismiss }) => {
	const {
		selectedWallet,
		walletAddress,
		connectWallet,
		isHardwareWallet,
		switchAccounts,
		disconnectWallet,
	} = Connector.useContainer();

	const { blockExplorerInstance } = Etherscan.useContainer();
	const { theme } = UI.useContainer();

	return (
		<>
			{walletAddress != null ? (
				<Container>
					<WalletDetails>
						<SelectedWallet>{getWalletIcon(selectedWallet?.toLowerCase())}</SelectedWallet>
						<WalletAddress>{truncateAddress(walletAddress)}</WalletAddress>
						<ActionIcons>
							<CopyToClipboard text={walletAddress} />
							<LinkContainer>
								<WrappedExternalLink href={blockExplorerInstance?.addressLink(walletAddress!)}>
									<Image
										src={theme === ThemeMode.LIGHT ? LinkIconBlack : LinkIconWhite}
										alt="etherscan-link"
									/>
								</WrappedExternalLink>
							</LinkContainer>
						</ActionIcons>
					</WalletDetails>
					<Buttons>
						<StyledButton
							fullWidth
							isRounded
							size="lg"
							variant="secondary"
							onClick={() => {
								onDismiss();
								connectWallet();
							}}
						>
							Change wallet
						</StyledButton>
						{isHardwareWallet() && (
							<StyledButton
								fullWidth
								isRounded
								size="lg"
								variant="secondary"
								onClick={() => {
									onDismiss();
									switchAccounts();
								}}
							>
								Switch account
							</StyledButton>
						)}
					</Buttons>
					<Buttons>
						<StyledButton
							fullWidth
							isRounded
							size="lg"
							variant="secondary"
							onClick={() => {
								onDismiss();
								disconnectWallet();
							}}
						>
							Disconnect
						</StyledButton>
					</Buttons>
				</Container>
			) : (
				<Container>
					<WalletDetails>
						<Buttons>
							<StyledButton
								fullWidth
								isRounded
								size="lg"
								variant="secondary"
								onClick={() => {
									onDismiss();
									connectWallet();
								}}
								data-testid="connect-wallet"
							>
								Connect Wallet
							</StyledButton>
						</Buttons>
					</WalletDetails>
				</Container>
			)}
		</>
	);
};

const StyledButton = styled(Button)`
	background: ${(props) => props.theme.colors.white};
	color: ${(props) => props.theme.colors.black};
	border-color: ${(props) => props.theme.colors.inputBorders};
	font-size: 0.8rem;
	font-family: ${(props) => props.theme.fonts.agrandir};
	&:hover {
		box-shadow: none !important;
	}
`;

const Container = styled.div`
	padding: 20px;
`;

const StyledImage = styled(Image)`
	top: 3px !important;
`;

const WalletDetails = styled.div`
	padding: 5px 0px;
`;

const SelectedWallet = styled(FlexDivCentered)`
	justify-content: center;
	img {
		width: 22px;
	}
`;

const WalletAddress = styled.div`
	margin: 6px 0;
	font-size: 1rem;
	text-align: center;
`;

const ActionIcons = styled(FlexDivCentered)`
	justify-content: center;
`;

const WrappedExternalLink = styled(ExternalLink)`
	display: flex;
	justify-content: center;
	align-items: center;
	max-height: 16px;
`;

const LinkContainer = styled(FlexDiv)`
	cursor: pointer;
	margin-left: 2px;
	svg {
		color: ${(props) => props.theme.colors.gray};
	}
	&:hover {
		svg {
			color: ${(props) => props.theme.colors.white};
		}
	}
`;

const Buttons = styled(FlexDivCol)`
	margin: 5px 0;
	width: 100%;
`;

export default WalletModal;

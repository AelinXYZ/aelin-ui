//@ts-nocheck
import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { ExternalLink, Tooltip, FlexDiv, FlexDivCol, FlexDivCentered } from 'components/common';
import Button from 'components/Button';
import CopyToClipboard from 'components/CopyToClipboard';

import BrowserWalletIcon from 'assets/wallet-icons/browserWallet.svg';
import LedgerIcon from 'assets/wallet-icons/ledger.svg';
import TrezorIcon from 'assets/wallet-icons/trezor.svg';
import WalletConnectIcon from 'assets/wallet-icons/walletConnect.svg';
import CoinbaseIcon from 'assets/wallet-icons/coinbase.svg';
import PortisIcon from 'assets/wallet-icons/portis.svg';
import TrustIcon from 'assets/wallet-icons/trust.svg';
import DapperIcon from 'assets/wallet-icons/dapper.png';
import TorusIcon from 'assets/wallet-icons/torus.svg';
import StatusIcon from 'assets/wallet-icons/status.svg';
import AuthereumIcon from 'assets/wallet-icons/authereum.png';
import ImTokenIcon from 'assets/wallet-icons/imtoken.svg';

import LinkIcon from 'assets/svg/link.svg';
import WalletIcon from 'assets/svg/wallet.svg';
import ArrowsChangeIcon from 'assets/svg/arrows-change.svg';
import ExitIcon from 'assets/svg/exit.svg';

import Connector from 'containers/Connector';
import Etherscan from 'containers/BlockExplorer';
import { truncateAddress } from 'utils/crypto';

const getWalletIcon = (selectedWallet?: string | null) => {
	switch (selectedWallet) {
		case 'browser wallet':
			return <Image src={BrowserWalletIcon} alt="browser-wallet" />;
		case 'trezor':
			return <Image src={TrezorIcon} alt="trezor-wallet" />;
		case 'ledger':
			return <Image src={LedgerIcon} alt="ledger-wallet" />;
		case 'walletconnect':
			return <Image src={WalletConnectIcon} alt="wallet-connect" />;
		case 'coinbase wallet':
		case 'walletlink':
			return <Image src={CoinbaseIcon} alt="coingbase-wallet" />;
		case 'portis':
			return <Image src={PortisIcon} alt="portis-wallet" />;
		case 'trust':
			return <Image src={TrustIcon} alt="trust-wallet" />;
		case 'dapper':
			return <Image src={DapperIcon} alt="dapper-wallet" />;
		case 'torus':
			return <Image src={TorusIcon} alt="torus-wallet" />;
		case 'status':
			return <Image src={StatusIcon} alt="status-wallet" />;
		case 'authereum':
			return <Image src={AuthereumIcon} alt="authereum-wallet" />;
		case 'imtoken':
			return <Image src={ImTokenIcon} alt="imtoken-wallet" />;
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

	return (
		<>
			{walletAddress != null ? (
				<>
					<WalletDetails>
						<SelectedWallet>{getWalletIcon(selectedWallet?.toLowerCase())}</SelectedWallet>
						<WalletAddress>{truncateAddress(walletAddress)}</WalletAddress>
						<ActionIcons>
							<CopyToClipboard text={walletAddress} />
							<Tooltip hideOnClick={false} arrow={true} placement="top" content="etherscan">
								<LinkContainer>
									<WrappedExternalLink href={blockExplorerInstance?.addressLink(walletAddress!)}>
										<Image src={LinkIcon} alt="etherscan-link" />
									</WrappedExternalLink>
								</LinkContainer>
							</Tooltip>
						</ActionIcons>
					</WalletDetails>
					<Buttons>
						<StyledButton
							onClick={() => {
								onDismiss();
								connectWallet();
							}}
						>
							<Image src={WalletIcon} alt="change-wallet" /> Change wallet
						</StyledButton>
						{isHardwareWallet() && (
							<StyledButton
								onClick={() => {
									onDismiss();
									switchAccounts();
								}}
							>
								<Image src={ArrowsChangeIcon} alt="switch-account" /> Switch account
							</StyledButton>
						)}
					</Buttons>

					<StyledButton
						onClick={() => {
							onDismiss();
							disconnectWallet();
						}}
					>
						<Image src={ExitIcon} alt="disconnect-wallet" /> Disconnect
					</StyledButton>
				</>
			) : (
				<WalletDetails>
					<Buttons>
						<StyledButton
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
			)}
		</>
	);
};

const StyledButton = styled(Button).attrs({
	variant: 'outline',
	size: 'lg',
})`
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	padding: 0 8px;
	width: 140px;
	display: inline-grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	justify-items: center;
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.black};
	cursor: pointer;

	margin: 12px 0;

	&:hover {
		color: ${(props) => props.theme.colors.white};
	}

	svg {
		margin-right: 5px;
		color: ${(props) => props.theme.colors.black};
	}
`;

const WalletDetails = styled.div`
	padding: 8px 0px;
`;

const SelectedWallet = styled(FlexDivCentered)`
	margin-top: 16px;
	justify-content: center;
	img {
		width: 22px;
	}
`;

const WalletAddress = styled.div`
	margin: 6px;
	font-family: ${(props) => props.theme.fonts.agrandir};
	font-size: 1.2rem;
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
	margin: 0px 8px;
`;

export default WalletModal;

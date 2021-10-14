import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
	ExternalLink,
	Tooltip,
	FlexDiv,
	FlexDivCol,
	FlexDivCentered,
	Divider,
} from 'components/common';
import Button from 'components/Button';

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

import CopyIcon from 'assets/svg/copy.svg';
import CheckIcon from 'assets/svg/check.svg';
import LinkIcon from 'assets/svg/link.svg';
import WalletIcon from 'assets/svg/wallet.svg';
import ArrowsChangeIcon from 'assets/svg/arrows-change.svg';
import ExitIcon from 'assets/svg/exit.svg';

import { FlexDivColCentered } from 'components/common';
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
	const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
	const { blockExplorerInstance } = Etherscan.useContainer();

	useEffect(() => {
		if (copiedAddress) {
			setInterval(() => {
				setCopiedAddress(false);
			}, 3000); // 3s
		}
	}, [copiedAddress]);

	return (
		<>
			{walletAddress != null ? (
				<>
					<WalletDetails>
						<SelectedWallet>{getWalletIcon(selectedWallet?.toLowerCase())}</SelectedWallet>
						<WalletAddress>{truncateAddress(walletAddress)}</WalletAddress>
						<ActionIcons>
							<Tooltip
								hideOnClick={false}
								arrow={true}
								placement="bottom"
								content={copiedAddress ? 'Copied' : 'Copy'}
							>
								<CopyClipboardContainer>
									<CopyToClipboard text={walletAddress!} onCopy={() => setCopiedAddress(true)}>
										{copiedAddress ? (
											<Image src={CheckIcon} alt="copied" />
										) : (
											<Image src={CopyIcon} alt={walletAddress} />
										)}
									</CopyToClipboard>
								</CopyClipboardContainer>
							</Tooltip>
							<Tooltip hideOnClick={false} arrow={true} placement="bottom" content="etherscan">
								<LinkContainer>
									<WrappedExternalLink href={blockExplorerInstance?.addressLink(walletAddress!)}>
										<Image src={LinkIcon} alt="etherscan-link" />
									</WrappedExternalLink>
								</LinkContainer>
							</Tooltip>
						</ActionIcons>
					</WalletDetails>
					<StyledDivider />
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
					<StyledDivider />

					<StyledTextButton
						onClick={() => {
							onDismiss();
							disconnectWallet();
						}}
					>
						<Image src={ExitIcon} alt="disconnect-wallet" /> Disconnect wallet
					</StyledTextButton>
				</>
			) : (
				<WalletDetails>
					<Buttons>
						<StyledGlowingButton
							onClick={() => {
								onDismiss();
								connectWallet();
							}}
							data-testid="connect-wallet"
						>
							Connect Wallet
						</StyledGlowingButton>
					</Buttons>
				</WalletDetails>
			)}
		</>
	);
};

const StyledGlowingButton = styled(Button).attrs({
	variant: 'secondary',
	size: 'lg',
})`
	padding: 0 20px;
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	text-transform: uppercase;
	margin: 4px 0px;
`;

const StyledButton = styled(Button).attrs({
	variant: 'outline',
	size: 'lg',
})`
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	padding: 0 20px;
	display: inline-grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	justify-items: center;
	text-transform: uppercase;

	margin: 6px 0px;

	svg {
		margin-right: 5px;
		color: ${(props) => props.theme.colors.gray};
	}
`;

const StyledTextButton = styled(Button).attrs({
	variant: 'text',
	size: 'lg',
})`
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	padding: 0 20px;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	justify-items: center;
	text-transform: uppercase;
	margin: -2px 0 6px 0;

	svg {
		margin-right: 5px;
		color: ${(props) => props.theme.colors.gray};
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
	font-size: 14px;
`;

const ActionIcons = styled(FlexDivCentered)`
	justify-content: center;
`;

const CopyClipboardContainer = styled(FlexDiv)`
	cursor: pointer;
	color: ${(props) => props.theme.colors.gray};
	margin-right: 2px;
	&:hover {
		svg {
			color: ${(props) => props.theme.colors.white};
		}
	}
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

const StyledDivider = styled(Divider)`
	margin: 8px 0px;
`;

export default WalletModal;

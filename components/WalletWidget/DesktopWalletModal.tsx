import { FC } from 'react';
import styled from 'styled-components';
import { FlexDivColCentered } from 'components/common';
import Image from 'next/image';

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

interface WalletOptionsProps {
	onDismiss: () => void;
}

export const DesktopWalletOptionsModal: FC<WalletOptionsProps> = ({ onDismiss }) => {
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

	return <>TODO</>;
};

const DesktopStyledMenuModal = styled(FlexDivColCentered)`
	margin-top: 12px;
	background: ${(props) => props.theme.colors.navy};
	border: 1px solid ${(props) => props.theme.colors.mediumBlue};
	border-radius: 4px;
`;

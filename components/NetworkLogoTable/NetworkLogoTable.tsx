import Image from 'next/image';
import OptimismLogo from 'assets/svg/optimism-logo.svg';
import EthereumLogo from 'assets/svg/ethereum-logo.svg';
import KovanLogo from 'assets/svg/kovan-logo.svg';
import { Network } from 'constants/networks';

const NetworkLogoTable = ({ networkName }: { networkName: string }): JSX.Element => {
	const getIconSrc = (network: string) => {
		switch (network) {
			case Network.Mainnet:
				return EthereumLogo;
			case Network.Kovan:
				return KovanLogo;
			default:
				return OptimismLogo;
		}
	};

	return (
		<Image
			width="30"
			height="30"
			layout="fixed"
			src={getIconSrc(networkName)}
			alt={networkName}
			title={networkName}
		/>
	);
};

export default NetworkLogoTable;

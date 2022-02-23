import { FC } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import EtherscanLogo from 'assets/svg/etherscan-logo.svg';

import Etherscan from 'containers/BlockExplorer';

interface EtherscanLinkProps {
	address: string;
}

const EtherscanLink: FC<EtherscanLinkProps> = ({ address }) => {
	const { blockExplorerInstance } = Etherscan.useContainer();

	return (
		<ExternalLink
			href={blockExplorerInstance?.addressLink(address)}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Image width="20" height="20" src={EtherscanLogo} alt="etherscan logo" />
		</ExternalLink>
	);
};

const ExternalLink = styled.a`
	margin: 0 10px;
`;

export default EtherscanLink;

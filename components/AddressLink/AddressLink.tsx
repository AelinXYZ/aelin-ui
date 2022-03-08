import { FC, ReactNode } from 'react';

import Etherscan from 'containers/BlockExplorer';
import styled from 'styled-components';

interface AddressLinkProps {
	address?: string;
	children: ReactNode | string;
}

const AddressLink: FC<AddressLinkProps> = ({ address = '', children }) => {
	const { blockExplorerInstance } = Etherscan.useContainer();

	return (
		<StyledLink
			href={blockExplorerInstance?.addressLink(address)}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</StyledLink>
	);
};

const StyledLink = styled.a`
	text-decoration: underline;
`;

export default AddressLink;

//@ts-nocheck
import { FC, useMemo } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AelinLogo from 'assets/svg/aelin-logo.svg';
import ROUTES from 'constants/routes';
import WalletWidget from 'components/WalletWidget';
import NetworkWidget from 'components/NetworkWidget';
import Connector from 'containers/Connector';

const Header: FC = () => {
	const router = useRouter();
	const { walletAddress } = Connector.useContainer();

	const LINKS = useMemo(() => {
		const links = [{ label: 'All Pools', pathname: ROUTES.Pools.Home }];
		return walletAddress != null
			? [
					...links,
					{
						label: 'My Sponsorships',
						pathname: ROUTES.Pools.Home,
						query: { sponsorFilter: walletAddress },
					},
					{ label: 'Create Pool', pathname: ROUTES.Pools.Create },
					// { label: 'Stake', pathname: ROUTES.Stake },
					{ label: 'Airdrop', pathname: ROUTES.Airdrop },
			  ]
			: links;
	}, [walletAddress]);
	return (
		<Container>
			<StyledImage
				onClick={() => router.push(ROUTES.Home)}
				src={AelinLogo}
				alt="aelin logo"
				width={98}
				height={22}
			/>
			<Links>
				{LINKS.map(({ label, pathname, query }) => (
					<StyledLink
						href={query != null ? { pathname, query } : { pathname }}
						key={`link-${label}`}
					>
						{label}
					</StyledLink>
				))}
			</Links>
			<HeaderBlock>
				<NetworkWidget />
				<WalletWidget />
			</HeaderBlock>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledImage = styled(Image)`
	cursor: pointer;
`;

const Links = styled.div`
	display: flex;
	width: 620px;
	justify-content: space-between;
	a {
		&:hover {
			color: ${(props) => props.theme.colors.headerGreen};
		}
	}
`;

const HeaderBlock = styled.div`
	display: flex;
	align-items: center;
	& > div:not(:first-child) {
		margin-left: 12px;
	}
`;

const StyledLink = styled(Link)`
	font-size: 14px;
`;

export default Header;

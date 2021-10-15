import { FC } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AelinLogo from 'assets/svg/aelin-logo.svg';
import ROUTES from 'constants/routes';
import NotificationCenter from 'components/NotificationCenter';
import WalletWidget from 'components/WalletWidget';

const LINKS = [
	{ label: 'All Pools', pathname: ROUTES.Pools.Home, query: { active: false } },
	{ label: 'Active Pools', pathname: ROUTES.Pools.Home, query: { active: true } },
	{ label: 'My Pools', pathname: ROUTES.Pools.MyPools },
	{ label: 'My Sponsorships', pathname: ROUTES.Sponsor },
	{ label: 'Create Pool', pathname: ROUTES.Pools.Create },
];

const Header: FC = () => {
	const router = useRouter();
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
				<NotificationCenter />
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
`;

const StyledLink = styled(Link)`
	font-size: 14px;
`;

export default Header;

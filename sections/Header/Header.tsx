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
	{ label: 'Pools', url: ROUTES.Pools.Home },
	{ label: 'My Pools', url: ROUTES.Pools.MyPools },
	{ label: 'Sponsors', url: ROUTES.Sponsors },
	{ label: 'Deals', url: ROUTES.Deals },
	{ label: 'Active', url: ROUTES.Pools.Active },
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
				{LINKS.map(({ label, url }) => (
					<StyledLink href={url} key={`link-${label}`}>
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
	width: 470px;
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

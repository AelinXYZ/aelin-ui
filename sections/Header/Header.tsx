import { FC, useMemo } from 'react';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AelinLogoLight from 'assets/svg/aelin-logo-light.svg';
import AelinLogoDark from 'assets/svg/aelin-logo-dark.svg';
import ROUTES from 'constants/routes';
import WalletWidget from 'components/WalletWidget';
import NetworkWidget from 'components/NetworkWidget';
import MeatballMenu from 'components/MeatballMenu';
import { FlexDivCentered } from 'components/common';
import UI from 'containers/UI';
import { ThemeMode } from 'styles/theme';

const Header: FC = () => {
	const router = useRouter();
	const { theme } = UI.useContainer();
	const LINKS = useMemo(
		() => [
			{ label: 'Pools', pathname: ROUTES.Pools.Home },
			{ label: 'Stake', pathname: ROUTES.Stake },
			{ label: 'Claim', pathname: ROUTES.ClaimTokens },
		],
		[]
	);
	return (
		<Container>
			<Content>
				<FlexDivCentered>
					<Link href={ROUTES.Home}>
						<a>
							<StyledImage
								src={theme === ThemeMode.LIGHT ? AelinLogoLight : AelinLogoDark}
								alt="aelin logo"
								width={98}
								height={22}
							/>
						</a>
					</Link>

					<Links>
						{LINKS.map(({ label, pathname, newTab, image }) => {
							return (
								<Link href={{ pathname }} key={`link-${label}`} passHref>
									<StyledLink isSelected={router.pathname === pathname} target="_self">
										{label}
									</StyledLink>
								</Link>
							);
						})}
					</Links>
				</FlexDivCentered>
				<HeaderBlock>
					<NetworkWidget />
					<Separator />
					<WalletWidget />
					<Separator />
					<MeatballMenu />
				</HeaderBlock>
			</Content>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	background: ${(props) => props.theme.colors.headerPrimary};
	height: 62px;
`;

const Content = styled.div`
	padding: 0 40px;
	display: flex;
	margin: 0 auto;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	max-width: 1440px;
`;

const StyledImage = styled(Image)`
	cursor: pointer;
`;

const Links = styled.div`
	display: flex;
	margin-left: 40px;
	justify-content: space-between;
	a {
		&:hover {
			color: ${(props) => props.theme.colors.headerGreen};
		}
	}
	a.is-disabled {
		text-decoration: none;
		pointer-events: none;
		opacity: 0.5;
	}
`;

const HeaderBlock = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledLink = styled.a<{ isSelected: boolean }>`
	font-size: 1.1rem;
	display: flex;
	align-items: center;
	padding: 6px 12px;
	border-radius: 25px;
	${(props) =>
		props.isSelected &&
		css`
			background-color: ${(props) => props.theme.colors.primary};
			color: ${(props) => props.theme.colors.secondary};
		`}}
`;

const Separator = styled.div`
	width: 1px;
	height: 24px;
	background: ${(props) => props.theme.colors.textBody};
	opacity: 0.5;
	margin: 0 24px;
`;

export default Header;

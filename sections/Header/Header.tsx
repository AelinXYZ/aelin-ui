import { FC, useMemo } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';

import AelinLogo from 'assets/svg/aelin-logo.svg';
import UniswapLogo from 'assets/svg/uniswap-logo.svg';
import GitbookLogo from 'assets/svg/gitbook-logo.svg';
import ROUTES from 'constants/routes';
import WalletWidget from 'components/WalletWidget';
import NetworkWidget from 'components/NetworkWidget';
import { ExternalLink, FlexDivCentered } from 'components/common';

const Header: FC = () => {
	const LINKS = useMemo(
		() => [
			{ label: 'Pools', pathname: ROUTES.Pools.Home },
			{ label: 'Stake', pathname: ROUTES.Stake },
			{ label: 'Claim', pathname: ROUTES.ClaimTokens },
			{ label: 'Buy Aelin OP', pathname: ROUTES.UniswapPoolOP, newTab: true, image: UniswapLogo },
			{ label: 'Buy Aelin L1', pathname: ROUTES.UniswapPoolL1, newTab: true, image: UniswapLogo },
			{ label: 'Docs', pathname: ROUTES.Docs, newTab: true, image: GitbookLogo },
		],
		[]
	);
	return (
		<Container>
			<Content>
				<FlexDivCentered>
					<Link href={ROUTES.Home}>
						<a>
							<StyledImage src={AelinLogo} alt="aelin logo" width={98} height={22} />
						</a>
					</Link>

					<Links>
						{LINKS.map(({ label, pathname, newTab, image }) => {
							return newTab ? (
								<StyledExternalLink key={`link-${label}`} href={pathname}>
									<>
										<ExternalLinkLabel>{label}</ExternalLinkLabel>
										<Image src={image} height={24} width={24} alt={`${label} logo`} />
									</>
								</StyledExternalLink>
							) : (
								<Link href={{ pathname }} key={`link-${label}`} passHref>
									<StyledLink target="_self">{label}</StyledLink>
								</Link>
							);
						})}
					</Links>
				</FlexDivCentered>
				<HeaderBlock>
					<NetworkWidget />
					<WalletWidget />
				</HeaderBlock>
			</Content>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	background: ${(props) => props.theme.colors.lightGreen};
	height: 82px;
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
	width: 500px;
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
	display: flex;
	align-items: center;
	& > div:not(:first-child) {
		margin-left: 12px;
	}
`;

const StyledLink = styled.a`
	font-size: 1.1rem;
	display: flex;
	align-items: center;
`;

const StyledExternalLink = styled(ExternalLink)`
	font-size: 1.1rem;
	display: flex;
	align-items: center;
`;

const ExternalLinkLabel = styled.span`
	margin-right: 4px;
`;

export default Header;

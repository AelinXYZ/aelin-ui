//@ts-nocheck
import { FC, useMemo } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';

import AelinLogo from 'assets/svg/aelin-logo.svg';
import ROUTES from 'constants/routes';
import WalletWidget from 'components/WalletWidget';
import NetworkWidget from 'components/NetworkWidget';
import { FlexDiv, ExternalLink } from 'components/common';

const Header: FC = () => {
	const LINKS = useMemo(
		() => [
			{ label: 'Pools', pathname: ROUTES.Pools.Home },
			{ label: 'Claim Aelin', pathname: ROUTES.ClaimTokens },
			{ label: 'Stake', pathname: ROUTES.Stake },
		],
		[]
	);
	return (
		<Container>
			<ImageContainer>
				<Link href={ROUTES.Home}>
					<a>
						<StyledImage src={AelinLogo} alt="aelin logo" width={98} height={22} />
						<BetaLabel>[alpha]</BetaLabel>
					</a>
				</Link>
			</ImageContainer>

			<Links>
				{LINKS.map(({ label, pathname, query, isDisabled, newTab }) => (
					<Link
						href={query != null ? { pathname, query } : { pathname }}
						key={`link-${label}`}
						passHref
					>
						<StyledLink
							className={isDisabled ? 'is-disabled' : ''}
							target={newTab ? '_blank' : '_self'}
						>
							{label}
						</StyledLink>
					</Link>
				))}
				<StyledExternalLink
					href={
						'https://info.uniswap.org/#/optimism/pools/0x5e8b0fc35065a5d980c11f96cb52381de390b13f'
					}
				>
					Uniswap Pool
				</StyledExternalLink>
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
	width: 400px;
	justify-content: space-between;
	a {
		&:hover {
			color: ${(props) => props.theme.colors.headerGreen};
			text-decoration: underline;
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
	font-size: 1.2rem;
`;

const StyledExternalLink = styled(ExternalLink)`
	font-size: 1.2rem;
`;

const ImageContainer = styled(FlexDiv)`
	align-items: flex-end;
`;

const BetaLabel = styled.span`
	font-size: 1rem;
	font-style: italic;
`;

export default Header;

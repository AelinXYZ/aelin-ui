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
import { FlexDiv } from 'components/common';

const Header: FC = () => {
	const router = useRouter();
	const LINKS = useMemo(
		() => [
			{ label: 'Pools', pathname: ROUTES.Pools.Home },
			{ label: 'Claim Aelin', pathname: ROUTES.ClaimTokens },
			{ label: 'Docs', pathname: ROUTES.Docs, newTab: true },
			{ label: 'Stake (coming soon)', pathname: ROUTES.Stake, isDisabled: true },
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
					<StyledLink
						href={query != null ? { pathname, query } : { pathname }}
						key={`link-${label}`}
						passHref
					>
						<a className={isDisabled ? 'is-disabled' : ''} target={newTab ? '_blank' : '_self'}>
							{label}
						</a>
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

const StyledLink = styled(Link)`
	font-size: 14px;
`;

const ImageContainer = styled(FlexDiv)`
	align-items: flex-end;
`;

const BetaLabel = styled.span`
	font-size: 14px;
	font-style: italic;
`;

export default Header;

import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import TwitterLogo from 'assets/svg/twitter-logo.svg';
import DiscordLogo from 'assets/svg/discord-logo.svg';
import GithubLogo from 'assets/svg/github-logo.svg';

import ROUTES from 'constants/routes';

const LOGOS = [
	{
		name: 'twitter',
		logo: TwitterLogo,
		url: 'https://twitter.com/aelinprotocol',
	},
	{ name: 'discord', logo: DiscordLogo, url: 'https://discord.gg/bPT5PRhNZT' },

	{ name: 'github', logo: GithubLogo, url: 'https://github.com/AelinXYZ' },
];

const Footer: FC = () => {
	const { asPath } = useRouter();

	return (
		<Container>
			{asPath === ROUTES.Home ? (
				// TODO: Define which one will stay here
				<NavColumn>
					<div>
						<Link href={ROUTES.Home} passHref>
							<StyledA>HOME. </StyledA>
						</Link>
						<Link href={ROUTES.Pools.Home} passHref>
							<StyledA>JOIN POOL. </StyledA>
						</Link>
						<Link href={ROUTES.Pools.Create} passHref>
							<StyledA>CREATE POOL. </StyledA>
						</Link>
						<Link href={ROUTES.Airdrop} passHref>
							<StyledA>AIRDROP. </StyledA>
						</Link>
					</div>
				</NavColumn>
			) : (
				<SocialRow>
					{LOGOS.map(({ name, logo, url }) => (
						<a key={`${name}-link`} href={url} target="_blank" rel="noreferrer">
							<Image src={logo} alt={`${name} logo`} />
						</a>
					))}
				</SocialRow>
			)}
		</Container>
	);
};

const Container = styled.div`
	margin-top: 20px;
	position: absolute;
	bottom: 50px;
	left: 50%;
	transform: translateX(-50%);
`;

const SocialRow = styled.div`
	display: flex;
	width: 168px;
	justify-content: space-between;
`;

const NavColumn = styled.div`
	display: flex;
	flex-direction: column;
`;

const StyledA = styled.a`
	color: #ffffff;
	font-size: 12px;
	letter-spacing: 0.62px;
	margin: 0 3px;
`;

export default Footer;

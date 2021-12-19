import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import TwitterLogo from 'assets/svg/twitter-logo.svg';
import DiscordLogo from 'assets/svg/discord-logo.svg';
import GithubLogo from 'assets/svg/github-logo.svg';

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
	console.log('asPath: ', asPath);

	return (
		<Container>
			{asPath === '/home' ? (
				// TODO: Define which one will stay here
				<NavColumn>
					<div>
						<Link href="/home" passHref>
							<StyledA>HOME. </StyledA>
						</Link>
						<Link href="/?" passHref>
							<StyledA>KNOWLEDGEBASE. </StyledA>
						</Link>
						<Link href="/about" passHref>
							<StyledA>ABOUT. </StyledA>
						</Link>
						<Link href="/pools" passHref>
							<StyledA>JOIN POOL. </StyledA>
						</Link>
						<Link href="/pools/create" passHref>
							<StyledA>CREATE POOL. </StyledA>
						</Link>
					</div>
					<div>
						<StyledP>
							©COPYRIGHT AELIN 2021. ALL RIGHTS RESERVED.{' '}
							<StyledNews>SIGN UP FOR AELIN NEWS</StyledNews>
						</StyledP>
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

const StyledP = styled.p`
	color: #ffffff;
	font-size: 12px;
	letter-spacing: 0.62px;
`;

const StyledNews = styled.a`
	color: #36a3a3;
	cursor: pointer;
`;

export default Footer;

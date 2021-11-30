import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

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

const Footer: FC = () => (
	<Container>
		<SocialRow>
			{LOGOS.map(({ name, logo, url }) => (
				<Link key={`${name}-link`} href={url} target="_blank">
					<Image src={logo} alt={`${name} logo`} />
				</Link>
			))}
		</SocialRow>
	</Container>
);

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

const Link = styled.a``;

export default Footer;

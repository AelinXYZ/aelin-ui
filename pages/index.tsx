import { FC } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import AelinLogo from 'assets/svg/aelin-logo.svg';
import ROUTES from 'constants/routes';

const Home: FC<NextPage> = () => {
	const router = useRouter();
	return (
		<Container>
			<Head>
				<title>Aelin</title>
			</Head>
			<Background>
				<Content>
					<Image src={AelinLogo} alt="Aelin Logo" />
					<ButtonRow>
						<Button onClick={() => router.push(ROUTES.Pools.Home)}>Join Pool</Button>
						<Button onClick={() => router.push(ROUTES.Pools.Create)}>Create Pool</Button>
						<Button>Learn More</Button>
					</ButtonRow>
					<Emoji>🧝‍♀️</Emoji>
					<Heading>Looking for your pools?</Heading>
					<ButtonWallet>Connect your wallet</ButtonWallet>
				</Content>
			</Background>
		</Container>
	);
};

const Container = styled.div`
	height: 100vh;
`;

const Background = styled.div`
	width: 100%;
	height: 100vh;
	background-image: url('/svg/background-ellipse.png');
	background-position: bottom;
	background-repeat: no-repeat;
	background-size: contain;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 390px;
	margin: 0 auto;
	height: 100%;
	text-align: center;
`;

const ButtonRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	margin: 52px 0 160px 0;
`;

const Button = styled.button`
	cursor: pointer;
	background: ${(props) => props.theme.colors.grey};
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	font-family: ${(props) => props.theme.fonts.agrandir};
	height: 35px;
	color: ${(props) => props.theme.colors.black};
	width: 110px;
	border-radius: 60px;
	&:hover {
		background: ${(props) => props.theme.colors.gradientForest};
		color: ${(props) => props.theme.colors.white};
	}
`;

const Emoji = styled.div`
	font-size: 32px;
`;

const Heading = styled.h1`
	font-family: ${(props) => props.theme.fonts.sometimes};
	font-weight: 100;
	font-size: 40px;
`;

const ButtonWallet = styled.button`
	outline: none;
	border: none;
	color: ${(props) => props.theme.colors.textGrey};
	font-family: ${(props) => props.theme.fonts.agrandir};
	background: none;
	font-size: 15px;
	text-decoration: underline;
	cursor: pointer;
`;

export default Home;

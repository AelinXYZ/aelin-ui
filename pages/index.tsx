import { FC } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';

import AelinLogo from 'assets/svg/aelin-logo.svg';

const Home: FC<NextPage> = () => {
	return (
		<Container>
			<Head>
				<title>Aelin</title>
			</Head>
			<Content>
				<Image src={AelinLogo} alt="Aelin Logo" />
				<ButtonRow>
					<Button>Join Pool</Button>
					<Button>Create Pool</Button>
					<Button>Learn More</Button>
				</ButtonRow>
				<Emoji>🧝‍♀️</Emoji>
				<Heading>Looking for your pools?</Heading>
				<ButtonWallet>Connect your wallet</ButtonWallet>
			</Content>
		</Container>
	);
};

const Container = styled.div`
	height: 100vh;
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

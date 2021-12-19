import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

import HomeBackground from 'assets/images/home_bg.jpeg';
import Main from 'assets/svg/homepage/main.svg';
import AelinLogo from 'assets/svg/homepage/logo.svg';
import CreatePoolImage from 'assets/svg/homepage/create-pool.svg';
import JoinPoolImage from 'assets/svg/homepage/join-pool.svg';

import Connector from 'containers/Connector';

const HomePage = () => {
	const { walletAddress, connectWallet, disconnectWallet } = Connector.useContainer();

	return (
		<Container>
			<Image src={HomeBackground} layout="fill" objectFit="cover" alt="Background image" />

			<LogoContainer>
				<Image src={AelinLogo} layout="fixed" width={220} height={80} alt="Create pool image" />

				<Subtitle>New interface launching soon!</Subtitle>
			</LogoContainer>

			<CenterContainer>
				<Row>
					<Link href="/pools">
						<a>
							<CreatePoolContainer>
								<Image
									src={JoinPoolImage}
									layout="fixed"
									width={180}
									height={60}
									alt="Join pool image"
								/>
								<ActionText>Join Pool</ActionText>
							</CreatePoolContainer>
						</a>
					</Link>

					<Image src={Main} layout="intrinsic" width={400} height={360} alt="Main image" />

					<Link href="/pools/create">
						<a>
							<CreatePoolContainer>
								<Image
									src={CreatePoolImage}
									layout="fixed"
									width={180}
									height={60}
									alt="Create pool image"
								/>
								<ActionText>Create Pool</ActionText>
							</CreatePoolContainer>
						</a>
					</Link>
				</Row>
				<Row>
					{!walletAddress ? (
						<ConnectWallet onClick={connectWallet}>Connect Wallet</ConnectWallet>
					) : (
						<ConnectWallet onClick={disconnectWallet}>Disconnect Wallet</ConnectWallet>
					)}
				</Row>
			</CenterContainer>
		</Container>
	);
};

const Container = styled.main`
	width: 100vw;
	height: 100vh;
`;

const CenterContainer = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-basis: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const LogoContainer = styled.div`
	width: 100%;
	margin-top: 20px;
	display: flex;
	position: absolute;
	align-items: center;
	flex-direction: column;
	flex-basis: 100%;
`;

const CreatePoolContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-basis: 100%;
`;

const ActionText = styled.span`
	font-family: Space-Age-Regular;
	color: #36a3a3;
	font-size: 22px;
	position: relative;
`;

const ConnectWallet = styled.button`
	font-family: Space-Age-Regular;
	color: #36a3a3;
	margin-top: 40px;
	font-size: 22px;
	z-index: 2;
	outline: 0;
	border: 0;
	background: transparent;
	cursor: pointer;
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const Subtitle = styled.h4`
	font-family: Space-Age-Regular;
	letter-spacing: 2px;
	color: #ffffff;
	font-size: 28px;
	text-align: center;
	margin-top: 20px;
`;

export default HomePage;

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';

import HomeBackground from 'assets/images/home-bg-light-theme.jpg';
import Main from 'assets/svg/homepage/main-light-theme.svg';
import AelinLogo from 'assets/svg/homepage/logo-light-theme.svg';
import CreatePoolImage from 'assets/svg/homepage/create-pool-light-theme.svg';
import JoinPoolImage from 'assets/svg/homepage/join-pool-light-theme.svg';

import ROUTES from 'constants/routes';

const HomePage = () => {
	return (
		<>
			<Head>
				<title>Aelin - Home</title>
			</Head>

			<Container>
				<Image src={HomeBackground} layout="fill" objectFit="cover" alt="Background image" />

				<LogoContainer>
					<Image src={AelinLogo} layout="fixed" width={220} height={80} alt="Create pool image" />
				</LogoContainer>

				<CenterContainer>
					<Row>
						<Link href={ROUTES.Pools.Home}>
							<a>
								<LinkContainer>
									<Image
										src={JoinPoolImage}
										layout="fixed"
										width={180}
										height={60}
										alt="Join pool image"
									/>
									<ActionText>Pools</ActionText>
								</LinkContainer>
							</a>
						</Link>

						<Image src={Main} layout="intrinsic" width={400} height={360} alt="Main image" />

						<Link href={ROUTES.Pools.Create}>
							<a>
								<LinkContainer>
									<Image
										src={CreatePoolImage}
										layout="fixed"
										width={180}
										height={60}
										alt="Create pool image"
									/>
									<ActionText>Create Pool</ActionText>
								</LinkContainer>
							</a>
						</Link>
					</Row>
					<Row>
						<Link href={ROUTES.ClaimTokens}>
							<a>
								<LinkContainer>
									<Image
										src={CreatePoolImage}
										layout="fixed"
										width={180}
										height={60}
										alt="Claim Tokens image"
									/>
									<ActionText>Claim Aelin</ActionText>
								</LinkContainer>
							</a>
						</Link>
					</Row>
				</CenterContainer>
			</Container>
		</>
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
	margin-top: 5%;
	display: flex;
	position: absolute;
	align-items: center;
	flex-direction: column;
	flex-basis: 100%;
`;

const LinkContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-basis: 100%;
	align-items: center;
`;

const ActionText = styled.span`
	font-family: Planetnv2-Regular;
	color: #5b8847;
	font-size: 1.4rem;
	position: relative;
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

export default HomePage;

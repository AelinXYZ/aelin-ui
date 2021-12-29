import Head from 'next/head';
import styled from 'styled-components';

import { PageLayout } from 'sections/Layout';
import { FlexDivCol } from 'components/common';
import Button from 'components/Button';

import StakeSection from 'sections/Stake/StakeSection';

const Stake = () => {
	return (
		<>
			<Head>
				<title>Aelin - Stake</title>
			</Head>
			<PageLayout title={<>Stake AELIN or AELIN-ETH LP tokens</>} subtitle="">
				<JustifiedLayout>
					<PageSection>
						<StakeSection
							header={'AELIN Staking'}
							tooltipInfo={
								'Staking AELIN gives a share of 29 AELIN/month in inflationary rewards + 2/3 of protocol deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.'
							}
							token={'AELIN'}
						/>
					</PageSection>
					<PageSection>
						<StakeSection
							header={'AELIN/ETH staking'}
							tooltipInfo={
								'Staking AELIN/ETH LP gives a share of 44 AELIN/month in inflationary rewards + 1/3 of deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.'
							}
							token={'AELIN/ETH LP'}
						/>
						<Section>
							<Text>
								To obtain AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH pool on
								Uniswap
							</Text>
							<SubmitButton
								onClick={() => window.open('https://app.uniswap.org/', 'blank')}
								variant="text"
							>
								Go to Uniswap
							</SubmitButton>
						</Section>
					</PageSection>
				</JustifiedLayout>
			</PageLayout>
		</>
	);
};

const Layout = styled.div`
	margin-top: 50px;
	justify-content: center;
	display: flex;
`;

const Section = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const PageSection = styled(FlexDivCol)`
	flex: 1;
	align-items: center;
`;

const JustifiedLayout = styled(Layout)`
	justify-content: space-around;
`;

const Text = styled.h3`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 14px;
	margin: 20px 0;
	padding: 0;
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 120px;
	margin: 10px auto 0 auto;
	&:hover {
		&:not(:disabled) {
			color: ${(props) => props.theme.colors.white};
			box-shadow: 0px 0px 10px rgba(71, 120, 48, 0.8);
		}
	}
`;

export default Stake;

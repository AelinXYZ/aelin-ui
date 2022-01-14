import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';

import { PageLayout } from 'sections/Layout';
import { FlexDivCol } from 'components/common';
import Button from 'components/Button';

import StakeSection from 'sections/Stake/StakeSection';
import ContractsInterface from 'containers/ContractsInterface';

import useGetStakingRewardsAPY from 'queries/stakingRewards/useGetStakingRewardsAPY';

const Stake = () => {
	const { contracts } = ContractsInterface.useContainer();

	const aelinStakingRewardsAPYQuery = useGetStakingRewardsAPY({
		stakingRewardsContract: contracts?.AelinStaking?.StakingContract ?? null,
		tokenContract: contracts?.AelinStaking?.TokenContract ?? null,
	});
	const aelinPoolAPY = aelinStakingRewardsAPYQuery?.data?.apy ?? 0;
	const aelinEthPoolAPY = null;

	return (
		<>
			<Head>
				<title>Aelin - Stake</title>
			</Head>
			<PageLayout title={<>Stake AELIN and AELIN-ETH LP tokens</>} subtitle="">
				<JustifiedLayout>
					<PageSection>
						<StakeSection
							header={'AELIN Staking'}
							tooltipInfo={
								'Staking AELIN gives a share of 29 AELIN/month in inflationary rewards + 2/3 of protocol deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.'
							}
							token={'AELIN'}
							contracts={contracts?.AelinStaking ?? null}
							apy={aelinPoolAPY}
						/>
					</PageSection>
					<PageSection>
						<StakeSection
							header={'AELIN/ETH staking'}
							tooltipInfo={
								'Staking AELIN/ETH LP gives a share of 44 AELIN/month in inflationary rewards + 1/3 of deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.'
							}
							token={'G-UNI'}
							contracts={contracts?.AelinEthStaking ?? null}
							apy={null}
						/>
						<Section>
							<Text>
								To obtain G-UNI AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH pool
								on Uniswap via Sorbet.Finance. A full tutorial can be found on our blog{' '}
								<Link href="https://medium.com/@aelinprotocol/b0f55bfc2976" passHref>
									<StyledAnchor target="_blank">here</StyledAnchor>
								</Link>
								.
							</Text>
							<SubmitButton
								onClick={() =>
									window.open(
										'https://www.sorbet.finance/#/pools/0x665d8D87ac09Bdbc1222B8B9E72Ddcb82f76B54A',
										'blank'
									)
								}
								variant="text"
							>
								Go to Sorbet.Finance
							</SubmitButton>
						</Section>
					</PageSection>
				</JustifiedLayout>
			</PageLayout>
		</>
	);
};

const StyledAnchor = styled.a`
	text-decoration: underline;
`;

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
	width: 400px;
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 14px;
	margin: 20px 0;
	padding: 0;
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	padding: 0 6px;
	margin: 10px auto 0 auto;
	&:hover {
		&:not(:disabled) {
			color: ${(props) => props.theme.colors.white};
			box-shadow: 0px 0px 10px rgba(71, 120, 48, 0.8);
		}
	}
`;

export default Stake;

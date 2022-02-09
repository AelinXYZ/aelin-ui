import { useMemo } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';

import { PageLayout } from 'sections/Layout';
import { FlexDivCol } from 'components/common';
import Button from 'components/Button';

import StakeSection from 'sections/Stake/StakeSection';
import Connector from 'containers/Connector';

import useGetStakingRewardsAPY from 'queries/stakingRewards/useGetStakingRewardsAPY';
import useGetUniswapStakingRewardsAPY from 'queries/stakingRewards/useGetUniswapStakingRewardsAPY';

import { getKeyValue } from 'utils/helpers';

import {
	aelinTokenAddresses,
	stakingRewardAddresses,
	LPStakingRewardAddresses,
	LPTokenAddresses,
} from 'constants/addresses';

type PoolInfo = {
	heading: string;
	headingTooltip: string;
	token: string;
	apyTooltip: string;
	apyQuery: Function;
	contracts: Record<string, string>;
	isLP: boolean;
	extraSection: object;
};

const Stake = () => {
	const { network } = Connector.useContainer();

	const allPools = useMemo(
		() => ({
			10: [
				{
					heading: 'AELIN Staking',
					headingTooltip:
						'Staking AELIN gives a share of 29 AELIN/month in inflationary rewards + 2/3 of protocol deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.',
					token: 'AELIN',
					apyTooltip:
						'Estimation based on the total amount of rewards for a year and the total value staked in the contract.',
					apyQuery: useGetStakingRewardsAPY,
					contracts: {
						staking: stakingRewardAddresses[10],
						token: aelinTokenAddresses[10],
					},
					isLP: false,
				},
				{
					heading: 'AELIN/ETH staking',
					headingTooltip:
						'Staking AELIN/ETH LP gives a share of 44 AELIN/month in inflationary rewards + 1/3 of deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.',
					token: 'G-UNI',
					apyTooltip:
						'Estimation based on the total amount of rewards for a year and the total value staked in the contract. Trading fees from Uniswap not included.',
					apyQuery: useGetUniswapStakingRewardsAPY,
					contracts: {
						staking: LPStakingRewardAddresses[10],
						token: LPTokenAddresses[10],
					},
					isLP: true,
					extraSection: (
						<Section>
							<Text>
								To obtain G-UNI AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH pool
								on Uniswap via Sorbet.Finance. A full tutorial can be found on our blog{' '}
								<Link
									href="https://mirror.xyz/aelingov.eth/vWMW887qout1flAyGJZ0mPJdpfrdaPSQeRt9X6cQqkQ"
									passHref
								>
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
					),
				},
			],
			1: [
				{
					heading: 'AELIN/ETH staking',
					headingTooltip:
						'Staking AELIN/ETH LP gives a share of 50 AELIN/month in inflationary rewards + 1/3 of deal fees. Note deal fees are temporarily custodied by the Aelin Council and will be distributed in the future.',
					token: 'UNI-V2',
					apyTooltip:
						'Estimation based on the total amount of rewards for a year and the total value staked in the contract. Trading fees from Uniswap not included.',
					apyQuery: useGetUniswapStakingRewardsAPY,
					contracts: {
						staking: LPStakingRewardAddresses[1],
						token: LPTokenAddresses[1],
					},
					isLP: true,
					extraSection: (
						<Section>
							<Text>
								To obtain UNI-V2 AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH
								pool on Uniswap.
							</Text>
							<SubmitButton
								onClick={() =>
									window.open(
										'https://app.uniswap.org/#/add/0xa9c125bf4c8bb26f299c00969532b66732b1f758/ETH/10000?chain=mainnet',
										'blank'
									)
								}
								variant="text"
							>
								Go to Uniswap
							</SubmitButton>
						</Section>
					),
				},
			],
		}),
		[]
	);

	const pools = useMemo(() => {
		if (!network?.id) return [];
		return (getKeyValue(allPools) as any)(network.id!);
	}, [network?.id, allPools]);

	return (
		<>
			<Head>
				<title>Aelin - Stake</title>
			</Head>
			<PageLayout title={<>Stake AELIN and AELIN-ETH LP tokens</>} subtitle="">
				{!pools || pools.length === 0 ? (
					<CenteredMessage>
						There is no staking program on this network at this moment.
					</CenteredMessage>
				) : (
					<JustifiedLayout>
						{pools.map((pool: PoolInfo, i: number) => (
							<PageSection key={`pool-${i}`}>
								<StakeSection
									header={pool.heading}
									tooltipInfo={pool.headingTooltip}
									token={pool.token}
									stakingContractAddress={pool.contracts.staking}
									tokenContractAddress={pool.contracts.token}
									apyQuery={pool.apyQuery}
									apyTooltip={pool.apyTooltip}
									isLP={pool.isLP}
								/>
								{pool.extraSection || null}
							</PageSection>
						))}
					</JustifiedLayout>
				)}
			</PageLayout>
		</>
	);
};

const CenteredMessage = styled.div`
	width: 100%;
	margin-top: 100px;
	text-align: center;
`;

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

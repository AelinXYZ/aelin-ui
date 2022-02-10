import { ethers } from 'ethers';
import { request, gql } from 'graphql-request';
import { useQuery } from 'react-query';
import erc20Abi from 'contracts/erc20';

import Connector from 'containers/Connector';

const ONE_YEAR = 365 * 24 * 3600;
const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
const PAIR_ID = '0x974d51fafc9013e42cbbb9465ea03fe097824bcc';

const useGetUniswapStakingRewardsAPY = ({
	stakingRewardsContract,
	tokenContract,
}: {
	stakingRewardsContract: ethers.Contract | null;
	tokenContract: ethers.Contract | null;
}) => {
	const { network, provider } = Connector.useContainer();
	return useQuery(
		[
			'uniswapStakingRewardsAPY',
			stakingRewardsContract?.address,
			tokenContract?.address,
			network?.id,
		],
		async () => {
			try {
				const UniV2Contract = new ethers.Contract(tokenContract?.address!, erc20Abi, provider);

				const query = gql`
					query getPair($id: String!) {
						pair(id: $id) {
							token0Price
							token1Price
							reserve0
							reserve1
						}
					}
				`;

				const variables = {
					id: PAIR_ID,
				};

				const [
					uniV2TotalSupply,
					ratesResults,
					graphData,
					rewardForDuration,
					duration,
					contractBalance,
				] = await Promise.all([
					UniV2Contract.totalSupply(),
					fetch(
						'https://api.coingecko.com/api/v3/simple/price?ids=aelin%2Cethereum&vs_currencies=usd'
					),
					request(GRAPH_ENDPOINT, query, variables),
					stakingRewardsContract?.getRewardForDuration(),
					stakingRewardsContract?.rewardsDuration(),
					tokenContract?.balanceOf(stakingRewardsContract?.address),
				]);
				const {
					pair: { reserve0: amount0, reserve1: amount1 },
				} = graphData;
				const {
					aelin: { usd: aelinRate },
					ethereum: { usd: ethRate },
				} = await ratesResults.json();

				const totalValueInPool = Number(amount0) * aelinRate + Number(amount1) * ethRate;
				const uniV2Price = totalValueInPool / (uniV2TotalSupply / 1e18);
				const yearProRata = ONE_YEAR / Number(duration);
				const uniV2ValueInContract = (contractBalance / 1e18) * uniV2Price;
				const rewardsValuePerYear = (rewardForDuration / 1e18) * yearProRata * aelinRate;

				return {
					aelin: Number(amount0),
					eth: Number(amount1),
					apy: (100 * rewardsValuePerYear) / uniV2ValueInContract,
				};
			} catch (e) {
				console.log(e);
			}
		},
		{
			enabled: !!stakingRewardsContract && !!network && !!network.id && !!tokenContract,
			refetchIntervalInBackground: false,
			refetchInterval: false,
		}
	);
};

export default useGetUniswapStakingRewardsAPY;

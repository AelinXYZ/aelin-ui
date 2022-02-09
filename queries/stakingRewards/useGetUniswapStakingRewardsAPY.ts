import { ethers } from 'ethers';
import { request, gql } from 'graphql-request';
import { useQuery } from 'react-query';

import Connector from 'containers/Connector';

const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
const TOKEN_0 = '0xa9c125bf4c8bb26f299c00969532b66732b1f758';
const TOKEN_1 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
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

				const data = await request(GRAPH_ENDPOINT, query, variables);

				const totalValueInPool =
					(amount0Current / 1e18) * ethRate + (amount1Current / 1e18) * aelinRate;

				console.log(data);
				return data;
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

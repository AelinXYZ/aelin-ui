import { ethers } from 'ethers';
import { request, gql } from 'graphql-request';
import { useQuery } from 'react-query';

import Connector from 'containers/Connector';

const GRAPH_ENDPOINT = 'https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v2';

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
					query getMovie($title: String!) {
						pair(title: $title) {
							releaseDate
							actors {
								name
							}
						}
					}
				`;

				const variables = {
					title: 'Inception',
				};

				const data = await request(GRAPH_ENDPOINT, query, variables);
				console.log(JSON.stringify(data, undefined, 2));
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

import { UseQueryOptions, useQuery } from 'react-query';

import Connector from 'containers/Connector';

import { isMainnet, NetworkId } from 'constants/networks';
import { Token, TokenListUrls, TestnetTokens, TokenListResponse } from 'constants/token';

const getTokenList = (networkId: NetworkId, isOVM: boolean) => {
	const isMainnetNetwork = isMainnet(networkId);
	if (isMainnetNetwork) {
		return fetch(isOVM ? TokenListUrls.Optimism : TokenListUrls.OneInch).then((x) => x.json());
	} else {
		return new Promise((resolve) => resolve({ tokens: [TestnetTokens[networkId]] }));
	}
};

const useTokenListQuery = (options?: UseQueryOptions<Token[]>) => {
	const { isOVM, network } = Connector.useContainer();
	return useQuery<Token[]>(
		['tokenList', network?.id, isOVM],
		async () => {
			const response: TokenListResponse = await getTokenList(network?.id, isOVM);
			let tokens: Token[] = response.tokens;
			if (isOVM) {
				tokens = response.tokens.filter(
					({ chainId }) => Number(chainId) === Number(NetworkId['Optimism-Mainnet'])
				);
			}

			return tokens;
		},
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			...options,
		}
	);
};
export default useTokenListQuery;

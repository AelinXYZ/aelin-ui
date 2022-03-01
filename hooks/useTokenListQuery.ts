import { Token, TokenListResponse } from 'constants/token';
import { UseQueryOptions, useQuery } from 'react-query';
import Connector from 'containers/Connector';
import { isMainnet, NetworkId } from 'constants/networks';
import { TokenListUrls, TestnetTokens } from 'constants/token';

const getTokenList = (isMainnet: boolean, isOVM: boolean) => {
	if (isMainnet) {
		return fetch(isOVM ? TokenListUrls.Optimism : TokenListUrls.OneInch).then((x) => x.json());
	} else {
		return new Promise((resolve) =>
			resolve({ tokens: [isOVM ? TestnetTokens.Optimism : TestnetTokens.Ethereum] })
		);
	}
};

const useTokenListQuery = (options?: UseQueryOptions<Token[]>) => {
	const { isOVM, network } = Connector.useContainer();
	const isMainnetNetwork = isMainnet(network?.id);
	return useQuery<Token[]>(
		['tokenList', network?.id, isMainnetNetwork, isOVM],
		async () => {
			const response: TokenListResponse = await getTokenList(isMainnetNetwork, isOVM);
			let tokens: Token[] = response.tokens;
			if (isOVM) {
				tokens = response.tokens.filter(
					({ chainId }) => Number(chainId) === Number(NetworkId['Optimism'])
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

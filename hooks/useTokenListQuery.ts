import { ether, Token, TokenListResponse } from 'constants/token';
import { UseQueryOptions, useQuery } from 'react-query';

const useTokenListQuery = (tokenListUrl: string, options?: UseQueryOptions<Token[]>) => {
	return useQuery<Token[]>(
		[tokenListUrl],
		async () => {
			const response: TokenListResponse = await fetch(tokenListUrl).then((x) => x.json());
			return [ether, ...response.tokens];
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

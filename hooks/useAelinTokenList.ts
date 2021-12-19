import { Token } from 'constants/token';
import useTokenListQuery from './useTokenListQuery';

type UseAelinTokenListReturn = {
	tokens: Token[];
	tokensByAddress: { [address: string]: Token | undefined };
};
const useAelinTokenList = () => {
	const tokenList = useTokenListQuery();
	if (tokenList.isLoading) return undefined;
	const allTokens = tokenList?.data ?? [];
	const { tokensByAddress, tokens } = allTokens.reduce(
		(acc: UseAelinTokenListReturn, token) => {
			const address = token.address.toLowerCase();
			if (acc.tokensByAddress[address]) {
				return acc;
			}
			acc.tokens.push(token);
			acc.tokensByAddress[address] = token;
			return acc;
		},
		{
			tokens: [],
			tokensByAddress: {},
		}
	);

	return { tokens, tokensByAddress };
};

export default useAelinTokenList;

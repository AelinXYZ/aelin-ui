import { Token, TokenListUrls } from 'constants/token';
import useTokenListQuery from './useTokenListQuery';

type UseAelinTokenListReturn = {
	tokens: Token[];
	tokensByAddress: { [address: string]: Token | undefined };
};
const useAelinTokenList = () => {
	const synthetixList = useTokenListQuery(TokenListUrls.Synthetix);
	const oneInchList = useTokenListQuery(TokenListUrls.OneInch);
	if (synthetixList.isLoading || oneInchList.isLoading) return undefined;
	const allTokens = synthetixList.data?.concat(oneInchList.data ?? []) || [];
	// remove duplicates, lowercase address and create tokensByAddress
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

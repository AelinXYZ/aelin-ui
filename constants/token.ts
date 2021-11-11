import { erc20Abi } from 'contracts/erc20';
import { ethers } from 'ethers';

export const TokenListUrls = {
	Synthetix: 'https://synths.snx.eth.link',
	OneInch: 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
};

export type Token = {
	address: string;
	chainId: number;
	decimals: number;
	logoURI: string;
	name: string;
	symbol: string;
	tags: string[];
};
export type TokenListResponse = {
	keywords: string[];
	logoURI: string;
	name: string;
	tags: unknown;
	timestamp: string;
	tokens: Token[];
	version: { major: number; minor: number; patch: number };
};

export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const ether = {
	address: ETH_ADDRESS,
	chainId: 1,
	decimals: 18,
	logoURI: '',
	name: 'Ethereum',
	symbol: 'ETH',
	tags: [],
};
type ValidateErc20AddressReturn =
	| { result: 'success'; token: Token }
	| { result: 'failure'; errorMessage: string };

export const validateErc20Address = async (
	address: string,
	provider: ethers.providers.Provider | null
): Promise<ValidateErc20AddressReturn> => {
	if (!provider) return { result: 'failure', errorMessage: 'Wallet not connected' };
	const contract = new ethers.Contract(address, erc20Abi, provider);
	const [name, symbol, decimals, totalSupply] = await Promise.all([
		contract.name(),
		contract.symbol(),
		contract.decimals(),
		contract.totalSupply(),
	]).catch(() => []);

	if (
		typeof name === 'string' &&
		typeof symbol === 'string' &&
		typeof decimals === 'number' &&
		totalSupply !== undefined
	) {
		const token: Token = {
			address,
			symbol,
			name,
			decimals,
			chainId: 1,
			tags: [],
			logoURI: '',
		};

		return {
			result: 'success',
			token,
		};
	}

	return { result: 'failure', errorMessage: 'Not a valid ERC20 address' };
};

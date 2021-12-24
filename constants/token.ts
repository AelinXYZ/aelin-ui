import { ethers } from 'ethers';
import { getERC20Data } from 'utils/crypto';

export const TokenListUrls = {
	OneInch: 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
	Optimism: 'https://static.optimism.io/optimism.tokenlist.json',
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

export const AELIN_GOV_ADDRESS: string = '0x7856f2a12a7a18b4a115d295f548434a9b078fa1';

export const ETH_ADDRESS: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const ether = {
	address: ETH_ADDRESS,
	chainId: 1,
	decimals: 18,
	logoURI: '',
	name: 'Ethereum',
	symbol: 'ETH',
	tags: [],
};

export const TestnetTokens = {
	Optimism: {
		address: '0xaA5068dC2B3AADE533d3e52C6eeaadC6a8154c57',
		chainId: 69,
		decimals: 18,
		logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png',
		name: 'sUSD',
		symbol: 'sUSD',
	},
	Ethereum: {
		address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
		chainId: 42,
		decimals: 18,
		logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
		name: 'DAI',
		symbol: 'DAI',
	},
};

type ValidateErc20AddressReturn =
	| { result: 'success'; token: Token }
	| { result: 'failure'; errorMessage: string };

export const validateErc20Address = async (
	address: string,
	provider: ethers.providers.Provider | undefined
): Promise<ValidateErc20AddressReturn> => {
	if (!provider) return { result: 'failure', errorMessage: 'Wallet not connected' };
	const { name, symbol, decimals, totalSupply } = await getERC20Data({ address, provider });

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

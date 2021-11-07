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

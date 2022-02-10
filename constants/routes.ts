const ROUTES = {
	Home: '/',
	Stake: '/stake',
	ClaimTokens: '/claim-tokens',
	Docs: 'https://docs.aelin.xyz',
	UniswapPoolOP:
		'https://info.uniswap.org/#/optimism/pools/0x5e8b0fc35065a5d980c11f96cb52381de390b13f',
	UniswapPoolL1:
		'https://app.uniswap.org/#/swap?outputCurrency=0xa9c125bf4c8bb26f299c00969532b66732b1f758&inputCurrency=ETH&chain=mainnet',
	Pools: {
		Home: '/pools',
		Create: '/pools/create',
		PoolView: (address: string) => `/pools/${address}`,
	},
};

export default ROUTES;

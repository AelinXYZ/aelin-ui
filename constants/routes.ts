const ROUTES = {
	Home: '/',
	Stake: '/stake',
	ClaimTokens: '/claim-tokens',
	Docs: 'https://docs.aelin.xyz',
	UniswapPool:
		'https://info.uniswap.org/#/optimism/pools/0x5e8b0fc35065a5d980c11f96cb52381de390b13f',
	Pools: {
		Home: '/pools',
		Create: '/pools/create',
		PoolView: (address: string) => `/pools/${address}`,
	},
};

export default ROUTES;

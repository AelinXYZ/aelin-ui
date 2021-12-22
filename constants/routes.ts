const ROUTES = {
	Home: '/',
	Stake: '/stake',
	ClaimTokens: '/claim-tokens',
	Docs: 'https://calavera.gitbook.io/aelin',
	Pools: {
		Home: '/pools',
		Create: '/pools/create',
		PoolView: (address: string) => `/pools/${address}`,
	},
};

export default ROUTES;

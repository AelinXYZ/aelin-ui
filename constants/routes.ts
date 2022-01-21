const ROUTES = {
	Home: '/',
	Stake: '/stake',
	ClaimTokens: '/claim-tokens',
	Docs: 'https://docs.aelin.xyz',
	Pools: {
		Home: '/pools',
		Create: '/pools/create',
		PoolView: (address: string) => `/pools/${address}`,
	},
};

export default ROUTES;

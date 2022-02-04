const ROUTES = {
	Home: '/',
	Stake: '/stake',
	ClaimTokens: '/claim-tokens',
	Pools: {
		Home: '/pools',
		Create: '/pools/create',
		PoolView: (address: string) => `/pools/${address}`,
	},
};

export default ROUTES;

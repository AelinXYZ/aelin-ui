const ROUTES = {
	Home: '/',
	Pools: {
		Home: '/pools',
		MyPools: '/pools/my-pools',
		Create: '/pools/create',
		Active: '/pools/active',
		PoolView: (address: string) => `/pools/${address}`,
	},
	Sponsors: '/sponsors',
	Deals: '/deals',
};

export default ROUTES;

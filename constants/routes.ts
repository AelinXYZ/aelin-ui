const ROUTES = {
	Home: '/',
	Pools: {
		Home: '/pools',
		MyPools: '/pools/my-pools',
		Create: '/pools/create',
		Active: '/pools/active',
		PoolView: (address: string) => `/pool/${address}`,
	},
	Sponsors: '/sponsors',
	Deals: '/deals',
};

export default ROUTES;

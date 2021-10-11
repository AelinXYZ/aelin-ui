const ROUTES = {
	Home: '/',
	Pools: {
		Home: '/pools',
		MyPools: '/pools/my-pools',
		Create: '/pools/create',
		Active: '/pools/active',
		PoolView: (address: string) => `/pools/${address}`,
	},
	Sponsor: '/sponsor',
};

export default ROUTES;

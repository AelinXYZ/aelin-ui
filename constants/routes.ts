const ROUTES = {
	Home: '/',
	Pools: {
		Home: '/pools',
		MyPools: '/pools/my-pools',
		Create: '/pools/create',
		PoolView: (address: string) => `/pools/${address}`,
	},
};

export default ROUTES;

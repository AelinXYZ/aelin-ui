const ROUTES = {
	Home: '/',
	Stake: '/stake',
	Airdrop: '/airdrop',
	Pools: {
		Home: '/pools',
		Create: '/pools/create',
		PoolView: (address: string) => `/pools/${address}`,
	},
};

export default ROUTES;

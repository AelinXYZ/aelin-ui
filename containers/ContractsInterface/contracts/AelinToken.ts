const abi = [
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},

	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
];

const contract = {
	42: {
		address: '0xca21a836936Dd9D46772E8fCB1284A7A3AE13fd2',
		abi,
	},
	10: {
		address: '0x61BAADcF22d2565B0F471b291C475db5555e0b76',
		abi,
	},
	1: {
		address: '0xca21a836936Dd9D46772E8fCB1284A7A3AE13fd2',
		abi,
	},
};

export default contract;

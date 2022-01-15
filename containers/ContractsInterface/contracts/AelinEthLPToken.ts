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
		address: '0x665d8d87ac09bdbc1222b8b9e72ddcb82f76b54a',
		abi,
	},
	10: {
		address: '0x665d8d87ac09bdbc1222b8b9e72ddcb82f76b54a',
		abi,
	},
	1: {
		address: '0x665d8d87ac09bdbc1222b8b9e72ddcb82f76b54a',
		abi,
	},
};

export default contract;

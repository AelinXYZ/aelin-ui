const abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_aelinPoolLogic',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_aelinDealLogic',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_aelinRewards',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'poolAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'name',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'symbol',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'purchaseTokenCap',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'purchaseToken',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'duration',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'sponsorFee',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sponsor',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'purchaseDuration',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'bool',
				name: 'hasAllowList',
				type: 'bool',
			},
		],
		name: 'CreatePool',
		type: 'event',
	},
	{
		inputs: [],
		name: 'AELIN_DEAL_LOGIC',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'AELIN_POOL_LOGIC',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'AELIN_REWARDS',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_name',
				type: 'string',
			},
			{
				internalType: 'string',
				name: '_symbol',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: '_purchaseTokenCap',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_purchaseToken',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_duration',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_sponsorFee',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_purchaseDuration',
				type: 'uint256',
			},
			{
				internalType: 'address[]',
				name: '_allowList',
				type: 'address[]',
			},
			{
				internalType: 'uint256[]',
				name: '_allowListAmounts',
				type: 'uint256[]',
			},
		],
		name: 'createPool',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];
const contract = {
	42: {
		address: '0x3347b7C7F491B4cD665656796614A729036Ff220',
		abi,
	},
	10: {
		address: '0x9219f9f65B007Fd3bA0b53762861f54062531a31',
		abi,
	},
	1: {
		address: '0x2C0979B0de5F99c2bde1E698AeCA13b55695951E',
		abi,
	},
};

export default contract;

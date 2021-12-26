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
		address: '0x1dD5Cb629968a5d736F5057df9FfeF605c593DBD',
		abi,
	},
	10: {
		address: '0x87525307974a312AF13a78041F88B0BAe23ebb10',
		abi,
	},
	1: {
		address: '0x5541DA82549D732878c4104C9887c408790397AF',
		abi,
	},
};

export default contract;

const contract = {
	42: {
		address: '0xedA0008e2afdfe87E57e5eC100269217fbd3389C',
		abi: [
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
						name: 'purchaseExpiry',
						type: 'uint256',
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
						name: '_purchaseExpiry',
						type: 'uint256',
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
		],
	},
};

export default contract;

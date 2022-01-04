const latestPoolAbi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'purchaser',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'dealAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'poolTokenAmount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'sponsorFee',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'aelinFee',
				type: 'uint256',
			},
		],
		name: 'AcceptDeal',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
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
				internalType: 'uint8',
				name: 'decimals',
				type: 'uint8',
			},
		],
		name: 'AelinToken',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
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
				indexed: true,
				internalType: 'address',
				name: 'sponsor',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'dealContract',
				type: 'address',
			},
		],
		name: 'CreateDeal',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'dealContract',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'underlyingDealToken',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'purchaseTokenTotalForDeal',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'underlyingDealTokenTotal',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'vestingPeriod',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'vestingCliff',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'proRataRedemptionPeriod',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'openRedemptionPeriod',
				type: 'uint256',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'holder',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'holderFundingDuration',
				type: 'uint256',
			},
		],
		name: 'DealDetail',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'purchaser',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'purchaseTokenAmount',
				type: 'uint256',
			},
		],
		name: 'PurchasePoolToken',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'sponsor',
				type: 'address',
			},
		],
		name: 'SetSponsor',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'purchaser',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'purchaseTokenAmount',
				type: 'uint256',
			},
		],
		name: 'WithdrawFromPool',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'poolTokenAmount',
				type: 'uint256',
			},
		],
		name: 'acceptDealTokens',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'acceptMaxDealTokens',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'acceptSponsor',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'aelinDeal',
		outputs: [
			{
				internalType: 'contract AelinDeal',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'aelinDealLogicAddress',
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
		name: 'aelinRewardsAddress',
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
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'allowList',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'amountAccepted',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'amountWithdrawn',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'calledInitialize',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_underlyingDealToken',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_purchaseTokenTotalForDeal',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_underlyingDealTokenTotal',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_vestingPeriod',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_vestingCliff',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_proRataRedemptionPeriod',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_openRedemptionPeriod',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_holder',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_holderFundingDuration',
				type: 'uint256',
			},
		],
		name: 'createDeal',
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
	{
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'subtractedValue',
				type: 'uint256',
			},
		],
		name: 'decreaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'futureSponsor',
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
		name: 'hasAllowList',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'holder',
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
		name: 'holderFundingExpiry',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'addedValue',
				type: 'uint256',
			},
		],
		name: 'increaseAllowance',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
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
				internalType: 'address',
				name: '_sponsor',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_purchaseDuration',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_aelinDealLogicAddress',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_aelinRewardsAddress',
				type: 'address',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'purchaser',
				type: 'address',
			},
		],
		name: 'maxDealAccept',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'purchaser',
				type: 'address',
			},
		],
		name: 'maxProRataAmount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		name: 'openPeriodEligible',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'poolExpiry',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'poolFactory',
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
		name: 'proRataConversion',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'purchaseExpiry',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_purchaseTokenAmount',
				type: 'uint256',
			},
		],
		name: 'purchasePoolTokens',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'purchaseToken',
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
		name: 'purchaseTokenCap',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'purchaseTokenDecimals',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'purchaseTokenTotalForDeal',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_sponsor',
				type: 'address',
			},
		],
		name: 'setSponsor',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'sponsor',
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
		name: 'sponsorFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalAmountAccepted',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalAmountWithdrawn',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'dst',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'src',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'dst',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
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
		name: 'updateAllowList',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'purchaseTokenAmount',
				type: 'uint256',
			},
		],
		name: 'withdrawFromPool',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'withdrawMaxFromPool',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

const oldPoolAbi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'purchaser',
				type: 'address',
			},
		],
		name: 'maxProRataAvail',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
];
const poolAbi = [...oldPoolAbi, ...latestPoolAbi];

export default poolAbi;

export enum TransactionStatus {
	PRESUBMIT = 'PRESUBMIT',
	WAITING = 'WAITING',
	FAILED = 'FAILED',
	SUCCESS = 'SUCCESS',
}

export enum TransactionDealType {
	AcceptDeal = 'ACCEPT_DEAL',
	Withdraw = 'WITHDRAW',
}

export enum TransactionPurchaseType {
	Allowance = 'ALLOWANCE',
	Purchase = 'PURCHASE',
}

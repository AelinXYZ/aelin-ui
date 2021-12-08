export enum TransactionStatus {
	PRESUBMIT = 'PRESUBMIT',
	WAITING = 'WAITING',
	FAILED = 'FAILED',
	SUCCESS = 'SUCCESS',
}

export enum TransactionType {
	Allowance = 'ALLOWANCE',
	Purchase = 'PURCHASE',
	Accept = 'ACCEPT',
	Withdraw = 'WITHDRAW',
	Vest = 'Vest',
}

import { createContainer } from 'unstated-next';
import { useState } from 'react';
import Wei, { wei } from '@synthetixio/wei';

import { GasLimitEstimate } from 'constants/networks';
import { Transaction } from 'constants/transactions';

const GAS_LIMIT_BUFFER_MULTIPLIER = 20;

const useTransactionData = () => {
	const [gasPrice, setGasPrice] = useState<Wei>(wei(0));
	const [gasLimitEstimate, setActualGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [txState, setTxState] = useState<Transaction>(Transaction.PRESUBMIT);
	const [txHash, setTxHash] = useState<string | null>(null);

	const setGasLimitEstimate = (gasEstimate: GasLimitEstimate) => {
		if (!gasEstimate) setActualGasLimitEstimate(null);
		setActualGasLimitEstimate(
			gasEstimate?.add(gasEstimate?.mul(wei(GAS_LIMIT_BUFFER_MULTIPLIER, 0)).div(100)) ?? null
		);
	};

	return {
		txHash,
		setTxHash,
		gasPrice,
		gasLimitEstimate,
		setGasPrice,
		setGasLimitEstimate,
		txState,
		setTxState,
	};
};

const TransactionData = createContainer(useTransactionData);

export default TransactionData;

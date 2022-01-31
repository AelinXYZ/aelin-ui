import { createContainer } from 'unstated-next';
import { useState } from 'react';
import Wei, { wei } from '@synthetixio/wei';

import { TransactionStatus } from 'constants/transactions';

const useTransactionData = () => {
	const [gasPrice, setGasPrice] = useState<Wei>(wei(0));
	const [txState, setTxState] = useState<TransactionStatus>(TransactionStatus.PRESUBMIT);
	const [txHash, setTxHash] = useState<string | null>(null);

	return {
		txHash,
		setTxHash,
		gasPrice,
		setGasPrice,
		txState,
		setTxState,
	};
};

const TransactionData = createContainer(useTransactionData);

export default TransactionData;

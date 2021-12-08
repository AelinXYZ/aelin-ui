import { createContainer } from 'unstated-next';
import { useState } from 'react';
import Wei, { wei } from '@synthetixio/wei';

import { TransactionStatus, TransactionType } from 'constants/transactions';

const useTransactionData = () => {
	const [gasPrice, setGasPrice] = useState<Wei>(wei(0));
	const [txState, setTxState] = useState<TransactionStatus>(TransactionStatus.PRESUBMIT);
	const [txHash, setTxHash] = useState<string | null>(null);
	const [txType, setTxType] = useState<TransactionType>(TransactionType.Purchase);

	return {
		txHash,
		setTxHash,
		gasPrice,
		setGasPrice,
		txState,
		setTxState,
		txType,
		setTxType,
	};
};

const TransactionData = createContainer(useTransactionData);

export default TransactionData;

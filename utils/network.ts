import Wei from '@synthetixio/wei';
import { GasLimitEstimate, GWEI_UNIT } from 'constants/networks';

export const getTransactionPrice = (
	gasPrice: Wei | null,
	gasLimit: GasLimitEstimate,
	ethPrice: Wei | null
) => {
	if (!gasPrice || !gasLimit || !ethPrice) return null;

	return gasPrice.mul(ethPrice).mul(gasLimit).div(GWEI_UNIT).toNumber().toFixed(2);
};
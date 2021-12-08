import Wei, { wei } from '@synthetixio/wei';
import { GasLimitEstimate, GWEI_UNIT } from 'constants/networks';

const GAS_LIMIT_BUFFER_MULTIPLIER = 15;

export const getTransactionPrice = (
	gasPrice: Wei | null,
	gasLimit: GasLimitEstimate,
	ethPrice: Wei | null
) => {
	if (!gasPrice || !gasLimit || !ethPrice) return null;

	return gasPrice.mul(ethPrice).mul(gasLimit).div(GWEI_UNIT).toNumber().toFixed(2);
};

export const getGasEstimateWithBuffer = (gasEstimate: GasLimitEstimate) => {
	if (!gasEstimate) return null;
	return gasEstimate?.add(gasEstimate?.mul(wei(GAS_LIMIT_BUFFER_MULTIPLIER, 0)).div(100)) ?? null;
};

import Wei, { wei } from '@synthetixio/wei';
import { GasLimitEstimate, GWEI_UNIT } from 'constants/networks';

const GAS_LIMIT_BUFFER_MULTIPLIER = 20;
const STAKING_EXTRA_MULTIPLIER = 15;

export const getTransactionPrice = (
	gasPrice: Wei | null,
	gasLimit: GasLimitEstimate,
	ethPrice: Wei | null
) => {
	if (!gasPrice || !gasLimit || !ethPrice) {
		return null;
	}
	return gasPrice.mul(ethPrice).mul(gasLimit).div(GWEI_UNIT).toNumber().toFixed(4);
};

export const getGasEstimateWithBuffer = (
	gasEstimate: GasLimitEstimate,
	isStaking: boolean = false
) => {
	if (!gasEstimate) {
		return null;
	}
	const newEstimate =
		gasEstimate?.add(gasEstimate?.mul(wei(GAS_LIMIT_BUFFER_MULTIPLIER, 0)).div(100)) ?? null;

	return isStaking
		? newEstimate?.add(newEstimate?.mul(wei(STAKING_EXTRA_MULTIPLIER, 0)).div(100))
		: newEstimate;
};

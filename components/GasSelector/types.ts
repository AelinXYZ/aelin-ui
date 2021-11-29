import { GasLimitEstimate } from 'constants/networks';
 
export type GasPrices = {
	fastest: number;
	fast: number;
	average: number;
};

export type GasSpeed = keyof GasPrices;

export interface IGasSelector {
	setGasPrice: Function;
	initialGasSpeed?: GasSpeed;
	gasLimitEstimate: GasLimitEstimate;
}

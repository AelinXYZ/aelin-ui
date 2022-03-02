import Wei, { wei } from '@synthetixio/wei';
import { CurrencyKey } from '@synthetixio/contracts-interface';

type Rates = Record<string, Wei>;

export const getExchangeRatesForCurrencies = (
	rates: Rates | null,
	base: CurrencyKey | null,
	quote: CurrencyKey | null
) => (rates == null || base == null || quote == null ? wei(0) : rates[base].div(rates[quote]));

export const iStandardSynth = (currencyKey: CurrencyKey) => currencyKey.startsWith('s');
export const synthToAsset = (currencyKey: CurrencyKey) =>
	currencyKey.replace(/^(i|s)/i, '') as CurrencyKey;

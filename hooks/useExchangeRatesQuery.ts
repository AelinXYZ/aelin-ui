import Wei, { wei } from '@synthetixio/wei';
import { BigNumberish, ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import  synthetix, { CurrencyKey } from '@synthetixio/contracts-interface';
import { iStandardSynth, synthToAsset } from 'utils/currencies';

import { NetworkType } from 'constants/networks';

type Rates = Record<string, Wei>;
type CurrencyRate = BigNumberish;
type SynthRatesTuple = [string[], CurrencyRate[]];

const useExchangeRatesQuery = (network: NetworkType, options?: UseQueryOptions<Rates>) => {
  const snxjs = synthetix({ network: network.name });

	return useQuery<Rates>(
		['rates', 'exchangeRates', network.id],
		async () => {
			const exchangeRates: Rates = {};

			const synthsRates: SynthRatesTuple = await snxjs.contracts.SynthUtil.synthsRates();

			const synths = [...synthsRates[0]] as CurrencyKey[];
			const rates = [...synthsRates[1]] as CurrencyRate[];

			synths.forEach((currencyKeyBytes32: CurrencyKey, idx: number) => {
				const currencyKey = ethers.utils.parseBytes32String(currencyKeyBytes32) as CurrencyKey;
				const rate = Number(ethers.utils.formatEther(rates[idx]));

				exchangeRates[currencyKey] = wei(rate);
				// only interested in the standard synths (sETH -> ETH, etc)
				if (iStandardSynth(currencyKey)) {
					exchangeRates[synthToAsset(currencyKey)] = wei(rate);
				}
			});

			return exchangeRates;
		},
		{
			enabled: !!network.id,
			...options,
		}
	);
};

export default useExchangeRatesQuery;
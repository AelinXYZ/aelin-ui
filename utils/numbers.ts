import Wei, { wei } from '@synthetixio/wei';
import { ethers } from 'ethers';

type WeiSource = Wei | number | string | ethers.BigNumber;

export type FormatNumberOptions = {
	minDecimals?: number;
	maxDecimals?: number;
	prefix?: string;
	suffix?: string;
};

export type FormatCurrencyOptions = {
	minDecimals?: number;
	maxDecimals?: number;
	sign?: string;
	currencyKey?: string;
};

const numberWithCommas = (value: string, decimals?: number) => {
	var parts = value.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (decimals != null && decimals > 0 && (parts[1]?.length ?? 0) > decimals) {
		parts[1] = parts[1].slice(0, decimals);
	}
	return parts.join('.');
};

// To be augmented for when we have WEI support
export const formatNumber = (value: number, decimals?: number) => {
	return numberWithCommas(value.toString(), decimals);
};

export const truncateNumber = (number: number, first = 5, last = 5) => {
	const formattedNumber = formatNumber(number);
	return formattedNumber.toString().length > 16
		? `${String(formattedNumber).slice(0, first)}...${String(formattedNumber).slice(
				-last,
				String(formattedNumber).length
		  )}`
		: formattedNumber;
};

export const formatNumberToDisplay = (value: WeiSource, options?: FormatNumberOptions) => {
	const prefix = options?.prefix;
	const suffix = options?.suffix;

	let weiValue = wei(0);
	try {
		weiValue = wei(value);
	} catch {}

	const formattedValue = [];
	if (prefix) {
		formattedValue.push(prefix);
	}

	formattedValue.push(numberWithCommas(weiValue.toString(options?.minDecimals ?? 16)));

	if (suffix) {
		formattedValue.push(` ${suffix}`);
	}

	return formattedValue.join('');
};

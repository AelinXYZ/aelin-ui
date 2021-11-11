import { ethers } from 'ethers';
import { ONE_YEAR_IN_SECS, ONE_MINUTE_IN_SECS, ONE_DAY_IN_SECS } from 'constants/time';
import { convertToSeconds } from 'utils/time';

export interface CreatePoolValues {
	purchaseToken: string;
	poolName: string;
	poolSymbol: string;
	poolCap: number;
	durationDays: number;
	durationHours: number;
	durationMinutes: number;
	sponsorFee: number;
	purchaseExpiryDays: number;
	purchaseExpiryHours: number;
	purchaseExpiryMinutes: number;
}

const validateCreatePool = (values: CreatePoolValues) => {
	const errors: any = {};

	if (!values.purchaseToken) {
		errors.purchaseToken = 'Required';
	} else if (!ethers.utils.isAddress(values.purchaseToken)) {
		errors.purchaseToken = 'Invalid Ethereum address';
	}

	if (!values.poolName) {
		errors.poolName = 'Required';
	} else if (values.poolName.length > 10) {
		errors.poolName = 'No more than 10 chars';
	}

	if (!values.poolSymbol) {
		errors.poolSymbol = 'Required';
	} else if (values.poolSymbol.length > 5) {
		errors.poolSymbol = 'No more than 5 chars';
	}

	if (!values.sponsorFee) {
		errors.sponsorFee = 'Required';
	} else if (values.sponsorFee > 98) {
		errors.sponsorFee = 'Must be <= 98';
	}

	if (!values.durationDays && !values.durationHours && !values.durationMinutes) {
		errors.durationMinutes = 'Required';
	} else {
		const durationSeconds = convertToSeconds({
			days: values?.durationDays ?? 0,
			hours: values?.durationHours ?? 0,
			minutes: values?.durationMinutes ?? 0,
		});
		if (durationSeconds > ONE_YEAR_IN_SECS) {
			errors.durationMinutes = 'Max duration is 365 days';
		}
	}

	if (!values.purchaseExpiryDays && !values.purchaseExpiryHours && !values.purchaseExpiryMinutes) {
		errors.purchaseExpiryMinutes = 'Required';
	} else {
		const purchaseExpirySeconds = convertToSeconds({
			days: values?.purchaseExpiryDays ?? 0,
			hours: values?.purchaseExpiryHours ?? 0,
			minutes: values?.purchaseExpiryMinutes ?? 0,
		});
		if (purchaseExpirySeconds > ONE_DAY_IN_SECS * 30) {
			errors.purchaseExpiryMinutes = 'Max purchase expiry is 30 days';
		} else if (purchaseExpirySeconds < ONE_MINUTE_IN_SECS * 30) {
			errors.purchaseExpiryMinutes = 'Min purchase expiry is 30 mins';
		}
	}

	return errors;
};

export default validateCreatePool;

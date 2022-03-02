import { ethers, utils } from 'ethers';
import { ONE_YEAR_IN_SECS, ONE_MINUTE_IN_SECS, ONE_DAY_IN_SECS } from 'constants/time';
import { convertToSeconds } from 'utils/time';

import { Privacy } from 'constants/pool';
import { NetworkId } from 'constants/networks';

export interface CreatePoolValues {
	purchaseToken: string;
	poolName: string;
	poolSymbol: string;
	poolCap: number;
	durationDays: number;
	durationHours: number;
	durationMinutes: number;
	sponsorFee: number;
	purchaseDurationDays: number;
	purchaseDurationHours: number;
	purchaseDurationMinutes: number;
	poolPrivacy: Privacy;
	whitelist: {
		address: string;
		amount: number | null;
		isSaved: boolean;
	}[];
}

const validateCreatePool = (values: CreatePoolValues, networkId?: NetworkId) => {
	const errors: any = {};

	if (!values.purchaseToken) {
		errors.purchaseToken = 'Required';
	} else if (!ethers.utils.isAddress(values.purchaseToken)) {
		errors.purchaseToken = 'Invalid Ethereum address';
	}

	if (!values.poolName) {
		errors.poolName = 'Required';
	} else if (values.poolName.length > 15) {
		errors.poolName = 'No more than 15 chars';
	}

	if (!values.poolSymbol) {
		errors.poolSymbol = 'Required';
	} else if (values.poolSymbol.length > 7) {
		errors.poolSymbol = 'No more than 7 chars';
	}

	if (values.sponsorFee > 98) {
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

	if (
		!values.purchaseDurationDays &&
		!values.purchaseDurationHours &&
		!values.purchaseDurationMinutes
	) {
		errors.purchaseDurationMinutes = 'Required';
	} else {
		const purchaseDurationSeconds = convertToSeconds({
			days: values?.purchaseDurationDays ?? 0,
			hours: values?.purchaseDurationHours ?? 0,
			minutes: values?.purchaseDurationMinutes ?? 0,
		});
		if (purchaseDurationSeconds > ONE_DAY_IN_SECS * 30) {
			errors.purchaseDurationMinutes = 'Max purchase expiry is 30 days';
		} else if (
			networkId === NetworkId.Kovan || networkId === NetworkId.Goerli
				? purchaseDurationSeconds < ONE_MINUTE_IN_SECS * 1
				: purchaseDurationSeconds < ONE_MINUTE_IN_SECS * 30
		) {
			errors.purchaseDurationMinutes = 'Min purchase expiry is 30 mins';
		}
	}

	if (values.poolPrivacy === Privacy.PRIVATE) {
		const hasAddressError = values.whitelist.some((row) => {
			if (!row.address.length) {return false;}

			return !utils.isAddress(row.address);
		});

		if (hasAddressError) {
			errors.whitelist = 'Address format not valid';
		} else {
			const isSaved = values.whitelist.every((row) => {
				if (!row.address.length) {return false;}

				return row.isSaved;
			});

			if (!isSaved) {errors.whitelist = 'Must save the values';}
		}
	}

	return errors;
};

export default validateCreatePool;

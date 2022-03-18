import { ethers } from 'ethers';
import { ONE_MINUTE_IN_SECS, ONE_DAY_IN_SECS } from 'constants/time';
import { convertToSeconds } from 'utils/time';
import { removeZeroes } from 'utils/string';
import { NetworkId } from 'constants/networks';

export interface CreateDealValues {
	underlyingDealToken: string;
	purchaseTokenTotal: number;
	underlyingDealTokenTotal: number;
	vestingPeriodDays: number;
	vestingPeriodHours: number;
	vestingPeriodMinutes: number;
	vestingCliffDays: number;
	vestingCliffHours: number;
	vestingCliffMinutes: number;
	proRataRedemptionDays: number;
	proRataRedemptionHours: number;
	proRataRedemptionMinutes: number;
	openRedemptionDays: number;
	openRedemptionHours: number;
	openRedemptionMinutes: number;
	holderFundingExpiryDays: number;
	holderFundingExpiryHours: number;
	holderFundingExpiryMinutes: number;
	holder: string;
}

const validateCreateDeal = (
	values: CreateDealValues,
	totalPoolSupply: string,
	networkId?: NetworkId
) => {
	const errors: any = {};

	if (!values.holder) {
		errors.holder = 'Required';
	} else if (!ethers.utils.isAddress(values.holder)) {
		errors.holder = 'Invalid Ethereum address';
	}

	if (!values.underlyingDealToken) {
		errors.underlyingDealToken = 'Required';
	} else if (!ethers.utils.isAddress(values.underlyingDealToken)) {
		errors.underlyingDealToken = 'Invalid Ethereum address';
	}

	if (!values.purchaseTokenTotal) {
		errors.purchaseTokenTotal = 'Required';
	} else if (Number(values.purchaseTokenTotal) > Number(totalPoolSupply)) {
		errors.purchaseTokenTotal = `Max is ${removeZeroes(totalPoolSupply)}`;
	}

	if (!values.underlyingDealTokenTotal) {
		errors.underlyingDealTokenTotal = 'Required';
	}

	if (
		!values.proRataRedemptionDays &&
		!values.proRataRedemptionHours &&
		!values.proRataRedemptionMinutes
	) {
		errors.proRataRedemptionMinutes = 'Required';
	} else {
		const proRataRedemptionSeconds = convertToSeconds({
			days: values?.proRataRedemptionDays ?? 0,
			hours: values?.proRataRedemptionHours ?? 0,
			minutes: values?.proRataRedemptionMinutes ?? 0,
		});
		if (proRataRedemptionSeconds > ONE_DAY_IN_SECS * 30) {
			errors.proRataRedemptionMinutes = 'Max pro rata is 30 days';
		} else if (
			networkId === NetworkId.Kovan || networkId === NetworkId.Goerli
				? proRataRedemptionSeconds < ONE_MINUTE_IN_SECS * 1
				: proRataRedemptionSeconds < ONE_MINUTE_IN_SECS * 30
		) {
			errors.proRataRedemptionMinutes = 'Min pro rata is 30 mins';
		}
	}

	const noOpenValues =
		!values.openRedemptionDays && !values.openRedemptionHours && !values.openRedemptionMinutes;
	// @ts-ignore
	if (values.purchaseTokenTotal === totalPoolSupply && !noOpenValues) {
		errors.openRedemptionMinutes = 'Pool supply maxed. Set open to 0';
		// @ts-ignore
	} else if (values.purchaseTokenTotal !== totalPoolSupply && noOpenValues) {
		errors.openRedemptionMinutes = 'Required';
	} else {
		const openRedemptionSeconds = convertToSeconds({
			days: values?.openRedemptionDays ?? 0,
			hours: values?.openRedemptionHours ?? 0,
			minutes: values?.openRedemptionMinutes ?? 0,
		});
		if (openRedemptionSeconds > ONE_DAY_IN_SECS * 30) {
			errors.openRedemptionMinutes = 'Max open is 30 days';
		} else if (
			networkId === NetworkId.Kovan || networkId === NetworkId.Goerli
				? openRedemptionSeconds < ONE_MINUTE_IN_SECS * 1 &&
				  // @ts-ignore
				  values.purchaseTokenTotal !== totalPoolSupply
				: openRedemptionSeconds < ONE_MINUTE_IN_SECS * 30 &&
				  // @ts-ignore
				  values.purchaseTokenTotal !== totalPoolSupply
		) {
			errors.openRedemptionMinutes = 'Min open is 30 mins';
		}
	}

	if (
		!values.holderFundingExpiryDays &&
		!values.holderFundingExpiryHours &&
		!values.holderFundingExpiryMinutes
	) {
		errors.holderFundingExpiryMinutes = 'Required';
	} else {
		const holderFundingExpirySeconds = convertToSeconds({
			days: values?.holderFundingExpiryDays ?? 0,
			hours: values?.holderFundingExpiryHours ?? 0,
			minutes: values?.holderFundingExpiryMinutes ?? 0,
		});
		if (holderFundingExpirySeconds > ONE_DAY_IN_SECS * 30) {
			errors.holderFundingExpiryMinutes = 'Max holder funding is 30 days';
		} else if (
			networkId === NetworkId.Kovan || networkId === NetworkId.Goerli
				? holderFundingExpirySeconds < ONE_MINUTE_IN_SECS * 1
				: holderFundingExpirySeconds < ONE_MINUTE_IN_SECS * 30
		) {
			errors.holderFundingExpiryMinutes = 'Min holder funding is 30 mins';
		}
	}

	return errors;
};

export default validateCreateDeal;

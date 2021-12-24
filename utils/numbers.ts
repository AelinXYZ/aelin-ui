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

export const formatNumberToDisplay = (number: number, maxLength = 12) => {
	const formattedNumber = formatNumber(number);

	return formattedNumber.toString().length > 16
		? String(formattedNumber).slice(0, maxLength)
		: formattedNumber;
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

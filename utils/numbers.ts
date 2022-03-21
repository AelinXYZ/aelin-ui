export const numberWithCommas = (value: string, decimals?: number) => {
	const parts = value.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (decimals != null && decimals > 0 && (parts[1]?.length ?? 0) > decimals) {
		parts[1] = parts[1].slice(0, decimals);
	}
	const newString = parts.join('.');
	return newString.endsWith('.0') ? newString.slice(0, -2) : newString;
};

// To be augmented for when we have WEI support
export const formatNumber = (value: number | string, decimals?: number) => {
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

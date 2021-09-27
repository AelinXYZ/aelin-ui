const numberWithCommas = (value: string) => {
	var parts = value.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
};

// To be augmented for when we have WEI support
export const formatNumber = (value: number) => {
	return numberWithCommas(value.toString());
};

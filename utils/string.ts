export const isEns = (x: string) => x.endsWith('.eth');

export const hasNonAsciiCharacters = (str: string) => /[^\u0000-\u007f]/.test(str);

export const removeZeroes = (str: string) => {
	const decimalArray = str.split('.');
	if (decimalArray.length > 1) {
		let numZeroes = 0;
		for (let i = decimalArray[1].length - 1; i > 0; i--) {
			if (decimalArray[1][i] === '0') {
				numZeroes -= 1;
			} else {
				break;
			}
		}
		const output = `${decimalArray[0]}.${
			numZeroes < 0 ? decimalArray[1].slice(0, numZeroes) : decimalArray[1]
		}`;
		return output.endsWith('.0') ? output.slice(0, -2) : output;
	}
	return str;
};

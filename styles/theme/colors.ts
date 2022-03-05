const colors = {
	black: '#252626',
	navy2: '#121212',
	navy1: '#152033',
	navy0: '#2C3647',
	red: '#e74c3c',
	pink: '#FF7777',
	green4: '#3F7923',
	green3: '#A2FF00',
	green2: '#07bc0c',
	green1: '#9FBC91',
	green0: '#F0F4ED',
	yellow: '#f1c40f',
	blue2: '#3498DB',
	blue1: '#A4F3FF',
	blue0: '#5D8999',
	grey8: '#FFFFFF1A',
	grey7: '#2E3646',
	grey6: '#444D5C',
	grey5: '#767676',
	grey4: '#C4C4C4',
	grey3: '#B9BCC2',
	grey2: '#C4C7CC',
	grey1: '#E2E2E2',
	grey0: '#F8F8F8',
	white: '#FFFFFF',
};

/**
 * Transparency goes from FF(100%) to 00 (0%)
 */
export const addTransparency = (transparency: string, color: string) => {
	return color.slice(0, 1) + transparency + color.slice(1, color.length);
};

export default colors;

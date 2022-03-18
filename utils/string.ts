export const isEns = (x: string) => x.endsWith('.eth');

export const hasNonAsciiCharacters = (str: string) => /[^\u0000-\u007f]/.test(str);

export const removeZeroes = (str: string) => str.replace(/(.0|(?<=(..))0*)$/, '');

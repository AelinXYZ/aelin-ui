export const hasNonAsciiCharacters = (str: string) => /[^\u0000-\u007f]/.test(str);

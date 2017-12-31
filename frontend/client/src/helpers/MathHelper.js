export const round = (number, digits) => parseFloat(Math.round(number * 100) / 100).toFixed(digits);
export const gained = (num1, num2) => (num1 === 0 ? 0 : (num2 - num1) / num1 * 100);
export const formatSigned = number => (number < 0 ? `${number}` : `+${number}`);

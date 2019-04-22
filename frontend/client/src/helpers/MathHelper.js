export const round = (number, digits) => {
    const output = Number(parseFloat(Math.round(number * 100) / 100).toFixed(digits));
    return isNaN(output) ? number : output;
};

export const gained = (num1, num2) => {
    if (round(num1, 4) === 0) {
        return 100;
    }
    if (round(num2, 4) === 0) {
        return -100;
    }
    return num1 === 0 ? 0 : ((num2 - num1) / num1) * 100;
};
export const formatSigned = number => (number < 0 ? `${number}` : `+${number}`);

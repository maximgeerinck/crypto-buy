export const bindPortfolioToCoin = (portfolio, coins) => {
    const map = {};

    portfolio.forEach((item) => {
        map[item.coinId] = { ...item, ...coins[item.coinId] };
    });

    return map;
}
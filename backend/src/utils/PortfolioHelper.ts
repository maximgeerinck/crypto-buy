export const bindPortfolioToCoin = (portfolio: any, coins: any) => {
    const map: any = {};

    portfolio.forEach((item: any) => {
        map[item.coinId] = { ...item };
        map[item.coinId].details = coins[item.coinId];
    });

    return map;
};

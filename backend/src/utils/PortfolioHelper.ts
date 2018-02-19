export const bindPortfolioToCoin = (portfolio: any, coins: any) => {
    const map: any = {};
    portfolio.forEach((item: any) => {
        if (!item) {
            return;
        }
        map[item.coinId] = { ...item };
        map[item.coinId].details = coins[item.coinId];
    });

    return map;
};

export const extractIds = (portfolio: any): string[] => {
    if (!portfolio) {
        return [];
    }
    return Array.from(new Set(portfolio.map((coin: any) => coin.coinId)));
};

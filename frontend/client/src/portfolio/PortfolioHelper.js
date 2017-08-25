export const reduceItems = items => {
    var reducer = (allCoins, coin) => {
        if (coin.coinId in allCoins) {
            // allCoins[coin.symbol].amount
            allCoins[coin.coinId].cost =
                (allCoins[coin.coinId].amount * allCoins[coin.coinId].cost + coin.amount * coin.boughtPrice) /
                (allCoins[coin.coinId].amount + coin.amount);
            allCoins[coin.coinId].amount += coin.amount;
        } else {
            allCoins[coin.coinId] = {
                amount: coin.amount,
                boughtPrice: coin.boughtPrice,
                symbol: coin.symbol,
                coinId: coin.coinId
            };
        }
        delete allCoins["undefined"];
        return allCoins;
    };

    return items.reduce(reducer, {});
};

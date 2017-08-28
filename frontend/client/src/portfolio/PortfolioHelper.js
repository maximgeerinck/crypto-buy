export const reduceItems = (items) => {
    var reducer = (allCoins, coin) => {
        if (coin.coinId in allCoins) {
            allCoins[coin.coinId].amount += coin.amount;
            allCoins[coin.coinId].boughtPrice =
                (allCoins[coin.coinId].amount * allCoins[coin.coinId].boughtPrice + coin.amount * coin.boughtPrice) /
                (allCoins[coin.coinId].amount + coin.amount);
        } else {
            allCoins[coin.coinId] = Object.assign({}, coin);
        }
        delete allCoins["undefined"];
        return allCoins;
    };

    return items.reduce(reducer, {});
};

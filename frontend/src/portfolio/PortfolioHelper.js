export const reduceItems = items => {
  var reducer = (allCoins, coin) => {
    if (coin.symbol in allCoins) {
      // allCoins[coin.symbol].amount
      allCoins[coin.symbol].cost =
        (allCoins[coin.symbol].amount * allCoins[coin.symbol].cost + coin.amount * coin.boughtPrice) /
        (allCoins[coin.symbol].amount + coin.amount);
      allCoins[coin.symbol].amount += coin.amount;
    } else {
      allCoins[coin.symbol] = {
        amount: coin.amount,
        boughtPrice: coin.boughtPrice,
        symbol: coin.symbol
      };
    }

    return allCoins;
  };

  return items.reduce(reducer, {});
};

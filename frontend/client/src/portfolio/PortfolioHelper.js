import * as MathHelper from "../helpers/MathHelper";
import * as CurrencyHelper from "../helpers/CurrencyHelper";
import cx from "classnames";
import styles from "./portfolioTracker.scss";

export const reduceItems = items => {
    var reducer = (allCoins, coin) => {
        if (coin.coinId in allCoins) {
            allCoins[coin.coinId].amount += coin.amount;
            allCoins[coin.coinId].boughtPrice =
                (allCoins[coin.coinId].amount * allCoins[coin.coinId].boughtPrice +
                    coin.amount * coin.boughtPrice) /
                (allCoins[coin.coinId].amount + coin.amount);
        } else {
            allCoins[coin.coinId] = Object.assign({}, coin);
        }
        delete allCoins["undefined"];
        return allCoins;
    };

    return items.reduce(reducer, {});
};

export const marketItemsToMap = marketItems => {
    let map = {};
    for (const item of marketItems) {
        map[item.coinId] = item;
    }
    return map;
};

export const linkPortfolioToMarket = (portfolio, marketItems) => {
    marketItems = marketItemsToMap(marketItems);
    let portfolioCopy = { ...portfolio };
    for (const key of Object.keys(portfolio)) {
        portfolioCopy[key] = { ...portfolioCopy[key], market: { ...marketItems[key] } };
    }
    return portfolioCopy;
};

export const portfolioView = (portfolio, initialInvestment, currency, currencies) => {
    let view = {
        netWorth: 0,
        profit: 0,
        initialInvestment: CurrencyHelper.format(
            currency.symbolFormat,
            Math.round(initialInvestment, 2),
        ),
        items: [],
    };

    for (const key of Object.keys(portfolio)) {
        if (portfolio[key].market && portfolio[key].market.price) {
            let portfolioItem = portfolio[key];
            let viewItem = portfolioItemView(portfolioItem, currency, currencies);
            view.items.push(viewItem);
            view.netWorth += portfolio[key].market.price * currency.rate * portfolio[key].amount;
        }
    }

    const profit = view.netWorth - initialInvestment;
    const netWorth = view.netWorth;
    view.netWorthRaw = MathHelper.round(view.netWorth, 2);
    view.netWorth = CurrencyHelper.format(
        currency.symbolFormat,
        MathHelper.round(view.netWorth, 2),
    );
    view.profit = CurrencyHelper.format(currency.symbolFormat, MathHelper.round(profit, 2));
    view.profitStyle = cx(styles.investedChange, profit > 0 ? styles.positive : styles.negative);
    view.profitInPercent = MathHelper.round(MathHelper.gained(initialInvestment, netWorth), 2);

    return view;
};

export const portfolioItemView = (portfolioItem, currency, currencies) => {
    if (!portfolioItem.market || !portfolioItem.market.price) {
        return;
    }
    let view = {
        price: portfolioItem.market.price * currency.rate,
        paid: portfolioItem.boughtPrice * currency.rate,
        amount: portfolioItem.amount,
        name: portfolioItem.market.name,
        id: portfolioItem.market.coinId,
        changes: portfolioItem.market.changes,
        history: portfolioItem.market.history,
        symbol: portfolioItem.market.symbol,
        boughtCurrency: currencies[portfolioItem.currency || "USD"],
        _id: portfolioItem._id,
    };

    if (isNaN(view.paid)) {
        view.paid = 0;
    }

    const netWorth = view.price * view.amount;
    const profit =
        (portfolioItem.market.price.usd - portfolioItem.boughtPrice * view.boughtCurrency.rate) *
        portfolioItem.amount *
        currency.rate;

    view.netWorth = CurrencyHelper.format(currency.symbolFormat, MathHelper.round(netWorth, 2));
    view.profit = CurrencyHelper.format(currency.symbolFormat, MathHelper.round(profit, 2));
    view.profitInPercent = MathHelper.round(MathHelper.gained(netWorth - profit, netWorth), 2);
    if (view.paid === 0) {
        view.profitInPercent = MathHelper.round(view.changes.percentHour, 2);
    }

    return view;
};

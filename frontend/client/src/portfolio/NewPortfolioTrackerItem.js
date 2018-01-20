import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Loader from "../components/Loader";
import { getCoinImage } from "../helpers/CoinHelper";
import FontAwesome from "react-fontawesome";
import itemStyles from "./portfolioTrackerItem.scss";

import { round } from "../helpers/MathHelper";
import * as CurrencyHelper from "../helpers/CurrencyHelper";

class PortfolioTrackerItem extends Component {
    static childContextTypes = {
        reactIconBase: PropTypes.object,
    };

    getChildContext() {
        return {
            reactIconBase: {
                size: "100%",
            },
        };
    }

    renderIndicator() {
        const { history, price } = this.props;

        let indicator = 0;
        let priceChangeIndicator = <span className={itemStyles.caret} />;
        if (!history || history.length === 0) return priceChangeIndicator;

        let previous = history.pop();
        let hItem;

        while (history.length) {
            hItem = history.pop();
            if (hItem.usd !== previous.usd && hItem.usd !== price) {
                // current coin is dropping
                if (hItem.usd > price) {
                    if (indicator > 0) {
                        indicator = -1;
                    } else if (hItem.usd > previous.usd) {
                        indicator--;
                    }
                } else {
                    if (indicator < 0) {
                        indicator = 1;
                    } else if (hItem.usd < previous.usd) {
                        indicator++;
                    }
                }
            }

            previous = hItem;
        }

        switch (true) {
            case indicator >= 3:
                priceChangeIndicator = (
                    <span
                        className={cx(itemStyles.caret, itemStyles.positive)}
                        style={{ marginBottom: "-20px" }}
                    >
                        <FontAwesome name="caret-up" />
                        <FontAwesome name="caret-up" />
                        <FontAwesome name="caret-up" />
                    </span>
                );
                break;
            case indicator === 2:
                priceChangeIndicator = (
                    <span
                        className={cx(itemStyles.caret, itemStyles.positive)}
                        style={{ marginBottom: "-10px" }}
                    >
                        <FontAwesome name="caret-up" />
                        <FontAwesome name="caret-up" />
                    </span>
                );
                break;
            case indicator === 1:
                priceChangeIndicator = (
                    <span className={cx(itemStyles.caret, itemStyles.positive)}>
                        <FontAwesome name="caret-up" />
                    </span>
                );
                break;
            case indicator === -1:
                priceChangeIndicator = (
                    <span className={cx(itemStyles.caret, itemStyles.negative)}>
                        <FontAwesome name="caret-down" />
                    </span>
                );
                break;
            case indicator === -2:
                priceChangeIndicator = (
                    <span
                        className={cx(itemStyles.caret, itemStyles.negative)}
                        style={{ marginBottom: "-10px" }}
                    >
                        <FontAwesome name="caret-down" />
                        <FontAwesome name="caret-down" />
                    </span>
                );
                break;
            case indicator <= -3:
                priceChangeIndicator = (
                    <span
                        className={cx(itemStyles.caret, itemStyles.negative)}
                        style={{ marginBottom: "-20px" }}
                    >
                        <FontAwesome name="caret-down" />
                        <FontAwesome name="caret-down" />
                        <FontAwesome name="caret-down" />
                    </span>
                );
                break;
            //no default
        }

        return priceChangeIndicator;
    }

    renderChange() {
        const { changeHour, changeDay, changeWeek } = this.props;
        const classChangeHour = changeHour >= 0 ? itemStyles.positive : itemStyles.negative;
        const classChangeDay = changeDay >= 0 ? itemStyles.positive : itemStyles.negative;
        const classChangeWeek = changeWeek >= 0 ? itemStyles.positive : itemStyles.negative;

        return (
            <ul className={itemStyles.change}>
                <li className={classChangeHour}>
                    <span className={itemStyles.changeType}>H</span>
                    <span>{changeHour}%</span>
                </li>
                <li className={classChangeDay}>
                    <span className={itemStyles.changeType}>D</span>
                    <span>{changeDay}%</span>
                </li>
                <li className={classChangeWeek}>
                    <span className={itemStyles.changeType}>W</span>
                    <span>{changeWeek}%</span>
                </li>
            </ul>
        );
    }

    renderChangeTotal() {
        const changeTotal = this.props.profitInPercent;
        const profit = this.props.profit;
        const paid = this.props.paid;

        const { settings } = this.props;

        // // in USD
        const classChangeTotal =
            parseFloat(changeTotal) >= 0
                ? cx(itemStyles.changeTotal, itemStyles.positive)
                : cx(itemStyles.changeTotal, itemStyles.negative);

        const coinProfitClass =
            parseFloat(changeTotal) > 0
                ? cx(itemStyles.value, itemStyles.positive)
                : cx(itemStyles.value, itemStyles.negative);

        const coinProfitDisplay =
            settings.price && paid !== 0 ? (
                <div className={coinProfitClass}>
                    <span dangerouslySetInnerHTML={{ __html: profit }} />
                </div>
            ) : null;

        return (
            <div className={classChangeTotal}>
                <span className={itemStyles.amount}>{coinProfitDisplay}</span>
                <span
                    className={cx(
                        itemStyles.percentage,
                        !coinProfitDisplay ? itemStyles.bigPercent : undefined,
                    )}
                >
                    {changeTotal}%
                </span>
            </div>
        );
    }

    renderHoldings() {
        const { symbol, amount, price, currency, settings } = this.props;

        const total = CurrencyHelper.format(currency.symbolFormat, round(price * amount, 7));
        const indicator = this.renderIndicator();
        const totalChange = this.renderChangeTotal();

        const a =
            settings.amount && settings.price ? (
                <li>
                    <span dangerouslySetInnerHTML={{ __html: total }} />
                </li>
            ) : (
                undefined
            );

        const am = settings.price ? (
            <li>
                {Math.round(amount, 7)} {symbol}
            </li>
        ) : (
            undefined
        );

        return (
            <div className={itemStyles.holdings}>
                <span className={itemStyles.indicator}>{indicator}</span>
                <ul>
                    {a}
                    {am}
                </ul>
                <div className={itemStyles.totalChange}>{totalChange}</div>
            </div>
        );
    }

    render() {
        const { name, id, settings, currency, price } = this.props;

        const loader = this.props.isUpdating ? (
            <Loader className={itemStyles.loader} color="#848484" />
        ) : null;

        let statistics;

        if (settings.change) {
            statistics = this.renderChange();
        }

        const priceFormatted = CurrencyHelper.format(currency.symbolFormat, round(price, 7));

        const holdings = settings.amount || settings.price ? this.renderHoldings() : undefined;

        return (
            <div className={itemStyles.portfolioItem}>
                {loader}
                <div className={itemStyles.heading}>
                    <img src={getCoinImage(id)} alt="Coin" />
                    <h2>
                        {name}
                        <span
                            className={itemStyles.coinPrice}
                            dangerouslySetInnerHTML={{ __html: priceFormatted }}
                        />
                    </h2>
                </div>

                {holdings}

                {statistics}
            </div>
        );
    }
}

PortfolioTrackerItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    changeHour: PropTypes.number.isRequired,
    changeDay: PropTypes.number.isRequired,
    changeWeek: PropTypes.number.isRequired,
    boughtPrice: PropTypes.number,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    isUpdating: PropTypes.bool.isRequired,
    history: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired,
};

PortfolioTrackerItem.defaultProps = {
    changeHour: 0,
    changeDay: 0,
    changeWeek: 0,
    boughtPrice: 0,
    price: 0,
    amount: 0,
    isUpdating: false,
    history: [],
    settings: {
        price: true,
        change: true,
        statistics: true,
        amount: true,
    },
};

export default PortfolioTrackerItem;

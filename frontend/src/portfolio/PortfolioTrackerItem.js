import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Loader from "../components/Loader";
import { getCoinImage } from "../helpers/CoinHelper";
import styles from "./portfolioTracker.scss";
import { FaCaretUp, FaCaretDown } from "react-icons/lib/fa";

import { round, gained } from "../helpers/MathHelper";

class PortfolioTrackerItem extends Component {
    static childContextTypes = {
        reactIconBase: PropTypes.object
    };

    getChildContext() {
        return {
            reactIconBase: {
                size: "100%"
            }
        };
    }

    renderIndicator() {
        const { history, price } = this.props;

        let indicator = 0;
        let priceChangeIndicator = null;

        indicator = history[history.length - 1].price < price ? 1 : -1;

        for (let i = history.length - 2; i >= 0; i--) {
            if (price < history[i].price && history[i].price !== history[i + 1].price) {
                if (indicator < 0) {
                    indicator = 0;
                }
                indicator++;
            } else if (price > history[i].price && history[i].price !== history[i + 1].price) {
                if (indicator > 0) {
                    indicator = 0;
                }
                indicator--;
            }
        }

        switch (true) {
            case indicator >= 3:
                priceChangeIndicator = (
                    <span className={cx(styles.caret, styles.positive)}>
                        <FaCaretUp />
                        <FaCaretUp />
                        <FaCaretUp />
                    </span>
                );
                break;
            case indicator === 2:
                priceChangeIndicator = (
                    <span className={cx(styles.caret, styles.positive)}>
                        <FaCaretUp />
                        <FaCaretUp />
                    </span>
                );
                break;
            case indicator === 1:
                priceChangeIndicator = (
                    <span className={cx(styles.caret, styles.positive)}>
                        <FaCaretUp />
                    </span>
                );
                break;
            case indicator === -1:
                priceChangeIndicator = (
                    <span className={cx(styles.caret, styles.negative)}>
                        <FaCaretDown />
                    </span>
                );
                break;
            case indicator === -2:
                priceChangeIndicator = (
                    <span className={cx(styles.caret, styles.negative)}>
                        <FaCaretDown />
                        <FaCaretDown />
                    </span>
                );
                break;
            case indicator <= -3:
                priceChangeIndicator = (
                    <span className={cx(styles.caret, styles.negative)}>
                        <FaCaretDown />
                        <FaCaretDown />
                        <FaCaretDown />
                    </span>
                );
                break;
        }

        return priceChangeIndicator;
    }

    renderChange() {
        const { changeHour, changeDay, changeWeek } = this.props;
        const classChangeHour = changeHour >= 0 ? styles.positive : styles.negative;
        const classChangeDay = changeDay >= 0 ? styles.positive : styles.negative;
        const classChangeWeek = changeWeek >= 0 ? styles.positive : styles.negative;

        return (
            <ul className={styles.change}>
                <li>
                    <span className={styles.changeType}>H</span>
                    <span className={classChangeHour}>{changeHour}%</span>
                </li>
                <li>
                    <span className={styles.changeType}>D</span>
                    <span className={classChangeDay}>{changeDay}%</span>
                </li>
                <li>
                    <span className={styles.changeType}>W</span>
                    <span className={classChangeWeek}>{changeWeek}%</span>
                </li>
            </ul>
        );
    }

    renderChangeTotal() {
        const { boughtPrice, rate, amount, price, changeDay, settings } = this.props;
        const changeTotal = boughtPrice ? gained(boughtPrice, price * rate) : changeDay;
        const classChangeTotal =
            changeTotal >= 0 ? cx(styles.changeTotal, styles.positive) : cx(styles.changeTotal, styles.negative);

        const coinProfit = round(price * amount * rate - boughtPrice * amount, 6);

        const coinProfitClass = coinProfit > 0 ? cx(styles.value, styles.positive) : cx(styles.value, styles.negative);
        const coinProfitDisplay = settings.price ? <div className={coinProfitClass}>{coinProfit}</div> : null;

        const priceChangeIndicator = this.renderIndicator();

        return (
            <div className={classChangeTotal}>
                <div className={styles.percentage}>
                    {round(changeTotal, 2)}%
                    {priceChangeIndicator}
                </div>
                {coinProfitDisplay}
            </div>
        );
    }

    renderCalculations() {
        const { currency, price, rate, amount } = this.props;
        const calculations = `${currency} ${round(price * rate, 6)} * ${amount} = ${currency} ${round(
            price * amount * rate,
            6
        )}`;
        return (
            <div className={styles.price}>
                <span className={styles.calculations}>{calculations}</span>
            </div>
        );
    }

    render() {
        const { name, symbol, id, settings } = this.props;

        const loader = this.props.isUpdating ? <Loader className={styles.loader} color="#848484" /> : null;

        let prices, changeTotalContainer, statistics;

        if (settings.amount && settings.price) {
            prices = this.renderCalculations();
        }

        if (settings.change) {
            statistics = this.renderChange();
            changeTotalContainer = this.renderChangeTotal();
        }

        return (
            <div className={styles.portfolioItem}>
                {loader}
                <div className={styles.details}>
                    <h2>
                        <img src={getCoinImage(id)} alt="Coin" /> {name} ({symbol})
                    </h2>
                    {statistics}
                    {prices}
                </div>
                {changeTotalContainer}
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
    boughtPrice: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string,
    isUpdating: PropTypes.bool.isRequired,
    history: PropTypes.array.isRequired,
    rate: PropTypes.number.isRequired,
    settings: PropTypes.object.isRequired
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
    rate: 1,
    settings: {
        price: true,
        change: true,
        statistics: true,
        amount: true
    }
};

export default PortfolioTrackerItem;

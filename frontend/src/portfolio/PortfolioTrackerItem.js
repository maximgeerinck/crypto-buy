import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Loader from "../components/Loader";
import { getCoinImage } from "../helpers/CoinHelper";
import styles from "./portfolioTracker.scss";
import { FaCaretUp, FaCaretDown, FaMinus } from "react-icons/lib/fa";

import { round, gained } from "../helpers/MathHelper";

class PortfolioTrackerItem extends Component {
    render() {
        const {
            name,
            symbol,
            changeHour,
            changeDay,
            changeWeek,
            price,
            amount,
            currency,
            id,
            history,
            boughtPrice,
            rate,
            settings
        } = this.props;

        const loader = this.props.isUpdating ? <Loader className={styles.loader} color="#848484" /> : null;

        const classChangeHour = changeHour >= 0 ? styles.positive : styles.negative;
        const classChangeDay = changeDay >= 0 ? styles.positive : styles.negative;
        const classChangeWeek = changeWeek >= 0 ? styles.positive : styles.negative;

        const calculations = `${currency} ${round(price, 6)} * ${amount} = ${currency} ${round(price * amount, 6)}`;

        let prices, changeTotalContainer, statistics;

        if (settings.amount && settings.price) {
            prices = (
                <div className={styles.price}>
                    <span className={styles.calculations}>{calculations}</span>
                </div>
            );
        }

        if (settings.change) {
            statistics = (
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

        if (settings.change) {
            let priceChangeIndicator = null;
            for (let i = history.length - 1; i >= 0; i--) {
                if (price < history[i].price) {
                    priceChangeIndicator = <FaCaretDown className={styles.negative} />;
                } else if (price > history[i].price) {
                    priceChangeIndicator = <FaCaretUp className={styles.positive} />;
                }
            }

            const changeTotal = boughtPrice ? gained(boughtPrice, price * rate) : changeDay;
            const classChangeTotal =
                changeTotal >= 0 ? cx(styles.changeTotal, styles.positive) : cx(styles.changeTotal, styles.negative);

            const coinProfit = round(price * amount * rate - boughtPrice * amount, 6);
            const coinProfitClass =
                coinProfit > 0 ? cx(styles.value, styles.positive) : cx(styles.value, styles.negative);
            const coinProfitDisplay = settings.price ? <div className={coinProfitClass}>{coinProfit}</div> : null;

            changeTotalContainer = (
                <div className={classChangeTotal}>
                    <div className={styles.percentage}>
                        {round(changeTotal, 2)}%
                        <span className={styles.caret}>{priceChangeIndicator}</span>
                    </div>
                    {coinProfitDisplay}
                </div>
            );
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

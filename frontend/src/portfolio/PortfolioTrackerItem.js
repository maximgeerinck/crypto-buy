import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Loader from "../components/Loader";
import { getCoinImage } from "../helpers/CoinHelper";
import styles from "./portfolioTracker.scss";

import { round } from "../helpers/MathHelper";

class PortfolioTrackerItem extends Component {
    render() {
        const {
            name,
            symbol,
            changeHour,
            changeDay,
            changeWeek,
            changeTotal,
            price,
            amount,
            currency,
            showStatistics,
            id
        } = this.props;

        const loader = this.props.isUpdating ? <Loader className={styles.loader} color="#848484" /> : null;

        const classChangeHour = changeHour >= 0 ? styles.positive : styles.negative;
        const classChangeDay = changeDay >= 0 ? styles.positive : styles.negative;
        const classChangeWeek = changeWeek >= 0 ? styles.positive : styles.negative;
        const classChangeTotal =
            changeTotal >= 0 ? cx(styles.changeTotal, styles.positive) : cx(styles.changeTotal, styles.negative);

        const statistics = showStatistics
            ? <ul className={styles.change}>
                  <li>
                      <span className={styles.changeType}>H</span>
                      <span className={classChangeHour}>
                          {changeHour}%
                      </span>
                  </li>
                  <li>
                      <span className={styles.changeType}>D</span>
                      <span className={classChangeDay}>
                          {changeDay}%
                      </span>
                  </li>
                  <li>
                      <span className={styles.changeType}>W</span>
                      <span className={classChangeWeek}>
                          {changeWeek}%
                      </span>
                  </li>
              </ul>
            : undefined;

        const prices = showStatistics
            ? <div className={styles.price}>
                  <span className={styles.calculations}>
                      Current: {currency} {round(price, 6)} * {amount} ={" "}
                  </span>
                  {currency} {round(price * amount, 6)}
              </div>
            : undefined;

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
                <div className={classChangeTotal}>
                    {round(changeTotal, 2)}%
                </div>
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
    changeTotal: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string,
    isUpdating: PropTypes.bool.isRequired,
    showStatistics: PropTypes.bool.isRequired
};

PortfolioTrackerItem.defaultProps = {
    changeHour: 0,
    changeDay: 0,
    changeWeek: 0,
    changeTotal: 0,
    price: 0,
    amount: 0,
    isUpdating: false,
    showStatistics: true
};

export default PortfolioTrackerItem;

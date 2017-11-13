import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Loader from "../components/Loader";
import { getCoinImage } from "../helpers/CoinHelper";
import styles from "./portfolioTracker.scss";
import FontAwesome from "react-fontawesome";

import { round, gained } from "../helpers/MathHelper";
import * as CurrencyHelper from "../helpers/CurrencyHelper";

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
    let priceChangeIndicator = <span className={styles.caret} />;
    if (!history || history.length === 0) return priceChangeIndicator;

    let previous = history.pop();
    let hItem;

    while (history.length) {
      hItem = history.pop();
      if (hItem.price !== previous.price && hItem.price !== price) {
        // current coin is dropping
        if (hItem.price > price) {
          if (indicator > 0) {
            indicator = -1;
          } else if (hItem.price > previous.price) {
            indicator--;
          }
        } else {
          if (indicator < 0) {
            indicator = 1;
          } else if (hItem.price < previous.price) {
            indicator++;
          }
        }
      }

      previous = hItem;
    }

    switch (true) {
    case indicator >= 3:
      priceChangeIndicator = (
        <span className={cx(styles.caret, styles.positive)} style={{ marginBottom: "-20px" }}>
                        <FontAwesome name="caret-up" />
                        <FontAwesome name="caret-up" />
                        <FontAwesome name="caret-up" />
                    </span>
      );
      break;
    case indicator === 2:
      priceChangeIndicator = (
        <span className={cx(styles.caret, styles.positive)} style={{ marginBottom: "-10px" }}>
                        <FontAwesome name="caret-up" />
                        <FontAwesome name="caret-up" />
                    </span>
      );
      break;
    case indicator === 1:
      priceChangeIndicator = (
        <span className={cx(styles.caret, styles.positive)}>
                        <FontAwesome name="caret-up" />
                    </span>
      );
      break;
    case indicator === -1:
      priceChangeIndicator = (
        <span className={cx(styles.caret, styles.negative)}>
                        <FontAwesome name="caret-down" />
                    </span>
      );
      break;
    case indicator === -2:
      priceChangeIndicator = (
        <span className={cx(styles.caret, styles.negative)} style={{ marginBottom: "-10px" }}>
                        <FontAwesome name="caret-down" />
                        <FontAwesome name="caret-down" />
                    </span>
      );
      break;
    case indicator <= -3:
      priceChangeIndicator = (
        <span className={cx(styles.caret, styles.negative)} style={{ marginBottom: "-20px" }}>
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
    const { boughtCurrency, boughtPrice, amount, price, changeDay, settings } = this.props;

    // in USD    
    const boughtAllCoinsPrice = boughtPrice / boughtCurrency.rate * amount;
    const currentAllCoinsPrice = price * amount;

    const changeTotal = boughtPrice ? gained(boughtAllCoinsPrice, currentAllCoinsPrice) : changeDay;
    const coinProfit = round((currentAllCoinsPrice - boughtAllCoinsPrice), 7);

    const classChangeTotal =
      changeTotal >= 0 ? cx(styles.changeTotal, styles.positive) : cx(styles.changeTotal, styles.negative);

    const coinProfitClass = coinProfit > 0 ? cx(styles.value, styles.positive) : cx(styles.value, styles.negative);
    const coinProfitDisplay = settings.price ? <div className={coinProfitClass}>{isNaN(coinProfit) ? undefined : coinProfit}</div> : null;

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
    const { currency, price, amount } = this.props;

    const priceFormated = CurrencyHelper.format(currency.symbolFormat, round(price * currency.rate, 6));
    const total = CurrencyHelper.format(currency.symbolFormat, round(price * currency.rate * amount, 6));

    const calculations = `${priceFormated} * ${amount} = ${total}`;

    return (
      <div className={styles.price}>
            <span className={styles.calculations} dangerouslySetInnerHTML={{ __html: calculations}}></span>
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
  boughtCurrency: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  history: PropTypes.array.isRequired,
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
  settings: {
    price: true,
    change: true,
    statistics: true,
    amount: true
  }
};

export default PortfolioTrackerItem;
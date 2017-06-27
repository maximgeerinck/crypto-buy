import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Loader from '../components/Loader';

import styles from './portfolio.scss';

const round = (number, digits) => parseFloat(Math.round(number * 100) / 100).toFixed(digits);

class PortfolioItem extends Component {
  render() {
    const { name, symbol, changeHour, changeDay, changeWeek, changeTotal, price, amount } = this.props;

    const loader = this.props.isUpdating ? <Loader className={styles.loader} color="#848484" /> : null;

    const classChangeHour = changeHour > 0 ? styles.positive : styles.negative;
    const classChangeDay = changeDay > 0 ? styles.positive : styles.negative;
    const classChangeWeek = changeWeek > 0 ? styles.positive : styles.negative;
    const classChangeTotal = changeTotal > 0
      ? cx(styles.changeTotal, styles.positive)
      : cx(styles.changeTotal, styles.negative);

    return (
      <div className={styles.portfolioItem}>
        {loader}
        <div className={styles.details}>
          <h2>{name} ({symbol})</h2>
          <ul className={styles.change}>
            <li><span className={styles.changeType}>H</span><span className={classChangeHour}>{changeHour}%</span></li>
            <li><span className={styles.changeType}>D</span><span className={classChangeDay}>{changeDay}%</span></li>
            <li>
              <span className={styles.changeType}>W</span><span className={classChangeWeek}>{changeWeek}%</span>
            </li>
          </ul>
          <div className={styles.price}>
            €{round(price * 0.88628518, 6)} * {amount} = €{round(price * 0.88628518 * amount, 6)}
          </div>
        </div>
        <div className={classChangeTotal}>
          {changeTotal}%
        </div>
      </div>
    );
  }
}

PortfolioItem.propTypes = {
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  changeHour: PropTypes.number.isRequired,
  changeDay: PropTypes.number.isRequired,
  changeWeek: PropTypes.number.isRequired,
  changeTotal: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool.isRequired
};

PortfolioItem.defaultProps = {
  name: 'Ethereum',
  symbol: 'ETH',
  changeHour: 0,
  changeDay: 0,
  changeWeek: 0,
  changeTotal: 0,
  price: 0,
  amount: 0,
  isUpdating: false
};

export default PortfolioItem;

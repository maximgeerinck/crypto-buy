import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PortfolioActions from './PortfolioActions';

import styles from './portfolio.scss';
import homeStyles from '../app/home.scss';
import Page from '../components/Page';
import PortfolioItem from './PortfolioItem';
import cx from 'classnames';

const round = (number, digits) => parseFloat(Math.round(number * 100) / 100).toFixed(digits);

class Portfolio extends Component {
  render() {
    const children = this.props.children;

    return (
      <div className={styles.portfolio}>
        {children}
      </div>
    );
  }
}

class PortfolioPage extends Component {
  componentDidMount() {
    if (!this.props.portfolio.items) {
      this.props.portfolioActions.retrieve();
    }
    this.props.portfolioActions.details();
    setInterval(this.props.portfolioActions.details, 5000);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.portfolio.details) {
      this.props.portfolioActions.details();
    }
  }

  render() {
    let totalPrice = 0;
    const invested = 1325;

    const isFetching = this.props.portfolio.page.get('isFetching');

    const items =
      this.props.portfolio.get('details') &&
      this.props.portfolio.get('details').currencies.map(c => {
        let amount = this.props.portfolio.get('items').filter(cu => cu.currency === c.symbol)[0].amount;
        totalPrice += amount * (c.price.usd * 0.88628518);

        return (
          <PortfolioItem
            name={c.name}
            symbol={c.symbol}
            changeHour={c.change.percent_1h}
            changeDay={c.change.percent_24h}
            changeWeek={c.change.percent_7d}
            changeTotal={c.change.percent_7d}
            price={c.price.usd}
            amount={amount}
            isUpdating={isFetching}
          />
        );
      });

    const investedGainedPercentage = round(totalPrice / invested * 100 - 100, 2);
    const investedGainedAmount = round(totalPrice - invested, 2);
    const investedGainedPercentageClass = investedGainedPercentage > 0
      ? cx(styles.investedGainedPercentage, styles.positive)
      : cx(styles.investedGainedPercentage, styles.negative);

    return (
      <Page custom className={homeStyles.main}>
        <div className={homeStyles.wrapper}>
          <div className={styles.totalPortfolioPrice}>
            €{round(totalPrice, 2)}
            <div className={styles.invested}>
              €{invested}
              <span className={investedGainedPercentageClass}>
                ({investedGainedPercentage}% = {investedGainedAmount}€)
              </span>
            </div>
          </div>
          <Portfolio>
            {items}
          </Portfolio>
        </div>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  portfolio: state.portfolio
});

const mapDispatchToProps = dispatch => {
  return {
    portfolioActions: bindActionCreators(PortfolioActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPage);

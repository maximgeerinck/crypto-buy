import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as PortfolioActions from "./PortfolioActions";
import * as CurrencyActions from "../currency/CurrencyActions";
import * as UserActions from "../user/UserActions";
import * as AppActions from "../app/AppActions";

import styles from "./portfolioTracker.scss";
import homeStyles from "../app/home.scss";
import formStyles from "../forms.scss";
import Page from "../components/Page";
import PortfolioTrackerItem from "./PortfolioTrackerItem";
import Loader from "../components/Loader";
import { reduceItems } from "./PortfolioHelper";
import cx from "classnames";
import pageStyles from "../components/page.scss";
import PortfolioPieChart from "./PortfolioPieChart";

import { round, gained } from "../helpers/MathHelper";
import * as CurrencyHelper from "../helpers/CurrencyHelper";

export class PortfolioTracker extends Component {
  render() {
    const children = this.props.children;

    return <div className={styles.portfolio}> {children} </div>;
  }
}

class PortfolioTrackerPage extends Component {
  componentWillMount() {
    const { currencyActions, userActions, user, portfolioActions } = this.props;

    // load currencies
    currencyActions.index();

    if (!user.loaded || user.retrievedOn < Date.now() + 3600) userActions.me();

    // load portfolio
    portfolioActions.retrieve().then(() => {
      // load portfolio stats
      portfolioActions.details();
    });
  }

  componentDidMount() {
    // load portfolio stats
    setInterval(this.props.portfolioActions.details, 10000);
  }

  hasCoins() {
    return this.props.portfolio.stats.get("coins").length > 0;
  }

  isLoading() {
    return (!this.props.portfolio.coins.get("loaded") ||
      !this.props.portfolio.stats.get("loaded") ||
      !this.props.currency.loaded ||
      !this.props.user.loaded
    );
  }

  renderNoCoins() {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
                <a href="/account" className={formStyles.button}>
                    You have not added coins yet, add them here{" "}
                </a>{" "}
            </div>
    );
  }

  getInvestmentStats(invested, portfolioWorth) {
    const investedGainedPercentage = round(gained(invested, portfolioWorth), 2);
    const investedGainedAmount = round(portfolioWorth - invested, 2);
    const investedChange =
      investedGainedPercentage > 0 ?
      cx(styles.investedChange, styles.positive) :
      cx(styles.investedChange, styles.negative);

    return {
      percentage: investedGainedPercentage,
      amount: investedGainedAmount,
      style: investedChange
    };
  }

  render() {
    const { portfolio, currency } = this.props;
    const user = this.props.user.get("user").toObject();

    if (this.isLoading())
      return (
        <Page custom className={homeStyles.main}>
                    <Loader />
                </Page>
      );

    const noCoins = !this.hasCoins() ? this.renderNoCoins() : null;
    const userCurrency = user.preferences.currency || "USD";
    const userInitialInvestment = user.preferences.initialInvestment || 0;
    const isFetching = !portfolio.stats.get("loaded");


    let totalPrice = 0,
      invested = userInitialInvestment > 0 ? userInitialInvestment : 0,
      coinDetails = portfolio.stats.get("coins"),
      currencyObj = currency.items[userCurrency],
      reducedPortfolio = reduceItems(portfolio.coins.get("items"));

    let data = {
      graph: [],
      itemContainers: []
    };

    for (const coin of coinDetails) {
      if (!coin || !reducedPortfolio[coin.coin_id]) continue;

      const boughtCurrency = currency.items[reducedPortfolio[coin.coin_id].currency] || currencyObj;
      const item = reducedPortfolio[coin.coin_id];
      const price = round(coin.price.usd * currencyObj.rate * item.amount, 2);

      totalPrice += parseFloat(price);

      if (item.boughtPrice && invested === 0) {
        invested += item.boughtPrice * item.amount;
      }

      data.itemContainers.push(
        <PortfolioTrackerItem
            key={coin._id}
            id={coin.coin_id}
            name={coin.name}
            symbol={coin.symbol}
            changeHour={coin.change.percent_1h}
            changeDay={coin.change.percent_24h}
            changeWeek={coin.change.percent_7d}
            boughtPrice={item.boughtPrice}
            price={coin.price.usd}
            boughtCurrency={boughtCurrency}
            currency={currencyObj}
            amount={item.amount}
            isUpdating={isFetching}
            history={coin.history}            
        />
      );

      data.graph.push({
        id: coin.coin_id,
        name: coin.symbol,
        symbol: coin.symbol,
        label: `${userCurrency} ${parseFloat(price)}`,
        total: parseFloat(price)
      });
    }

    const investment = this.getInvestmentStats(invested, totalPrice);
    const chart = this.hasCoins() ? (
      <PortfolioPieChart data={data.graph} customTooltip inPercent={false} />
    ) : (
      undefined
    );

    // set document title
    AppActions.setDocumentTitle(`${round(totalPrice, 2)} ${userCurrency} (${investment.percentage}%)`);

    const view = {
      worth: `${CurrencyHelper.format(currencyObj.symbolFormat, round(totalPrice, 2))}`,
      gained: `${CurrencyHelper.format(currencyObj.symbolFormat, round(investment.amount, 2))} (${investment.percentage}%)`,
      investment: `(based on investment of ${CurrencyHelper.format(currencyObj.symbolFormat, round(invested, 6))})`
    };

    return (
      <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
            <div className={styles.portfolioStats}>
                <h3 className={styles.portfolioTotal} dangerouslySetInnerHTML={{ __html: view.worth}}></h3>
                <div className={styles.invested}>
                    <p className={investment.style} dangerouslySetInnerHTML={{ __html: view.gained}}></p>
                    <p className={styles.investmentNotes} dangerouslySetInnerHTML={{ __html: view.investment}}></p>
                </div>
                {chart}
            </div>
            <PortfolioTracker> {data.itemContainers} </PortfolioTracker>
            {noCoins}
        </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio,
  auth: state.auth,
  currency: state.currency,
  user: state.user
});

const mapDispatchToProps = (dispatch) => {
  return {
    portfolioActions: bindActionCreators(PortfolioActions, dispatch),
    currencyActions: bindActionCreators(CurrencyActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioTrackerPage);
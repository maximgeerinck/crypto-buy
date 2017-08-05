import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as PortfolioActions from "./PortfolioActions";
import * as CurrencyActions from "../currency/CurrencyActions";
import * as UserActions from "../user/UserActions";

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

import { round } from "../helpers/MathHelper";

export class PortfolioTracker extends Component {
    render() {
        const children = this.props.children;

        return (
            <div className={styles.portfolio}>
                {" "}{children}{" "}
            </div>
        );
    }
}

class PortfolioTrackerPage extends Component {
    componentWillMount() {
        // load currencies
        this.props.currencyActions.index();

        if (!this.props.user.isLoaded) this.props.userActions.me();

        // load portfolio
        this.props.portfolioActions.retrieve().then(() => {
            // load portfolio stats
            this.props.portfolioActions.details();
        });
    }

    componentDidMount() {
        // load portfolio stats
        setInterval(this.props.portfolioActions.details, 10000);
    }

    render() {
        const { portfolio, currency } = this.props;
        const user = this.props.user.get("user").toObject();

        if (
            portfolio.coins.get("loading") ||
            portfolio.stats.get("loading") ||
            currency.loading ||
            !this.props.user.isLoaded
        )
            return (
                <Page custom className={homeStyles.main}>
                    <Loader />
                </Page>
            );

        const noCoins =
            portfolio.stats.get("coins").length === 0
                ? <div style={{ "text-align": "center", "margin-top": "20px" }}>
                      <a href="/account" className={formStyles.button}>
                          You have not added coins yet, add them here{" "}
                      </a>{" "}
                  </div>
                : null;

        const userCurrency = user.preferences.currency || "USD",
            userInitialInvestment = user.preferences.initialInvestment || 0;

        let totalPrice = 0,
            invested = 0,
            rate = currency.rates[userCurrency];

        const isFetching = portfolio.stats.get("loading");

        const itemContainers = portfolio.stats.get("coins").map((c, key) => {
            const items = reduceItems(portfolio.coins.get("items"));

            const i = items[c.id];

            // total increase since you bought
            let changeTotal = c.change.percent_1h;
            if (i.boughtPrice) {
                invested += i.boughtPrice * i.amount;
                totalPrice += i.amount * (c.price.usd * rate);

                let oldNumber = i.boughtPrice * i.amount;
                let newNumber = i.amount * c.price.usd;
                changeTotal = oldNumber === 0 ? 0 : (newNumber - oldNumber) / oldNumber * 100;
            }

            return (
                <PortfolioTrackerItem
                    key={key}
                    name={c.name}
                    symbol={c.symbol}
                    changeHour={c.change.percent_1h}
                    changeDay={c.change.percent_24h}
                    changeWeek={c.change.percent_7d}
                    changeTotal={changeTotal}
                    price={c.price.usd * rate}
                    currency={userCurrency}
                    amount={i.amount}
                    isUpdating={isFetching}
                />
            );
        });

        if (userInitialInvestment > 0) {
            invested = userInitialInvestment;
        }

        const investedGainedPercentage = round(totalPrice / invested * 100 - 100, 2);
        const investedGainedAmount = round(totalPrice - invested, 2);
        const investedChange =
            investedGainedPercentage > 0
                ? cx(styles.investedChange, styles.positive)
                : cx(styles.investedChange, styles.negative);

        document.title = `${round(totalPrice, 2)} ${userCurrency} (${investedGainedPercentage}%)`;

        // PIE CHART DATA
        const chartData = portfolio.stats.get("coins").map(coin => {
            const items = reduceItems(portfolio.coins.get("items"));
            const i = items[coin.id];
            let price = round(coin.price.usd * rate * i.amount, 2);

            return {
                symbol: coin.symbol,
                total: parseFloat(price)
            };
        });

        const chart = portfolio.stats.get("coins").length === 0 ? null : <PortfolioPieChart data={chartData} />;

        return (
            <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                {" "}{/* investment statistics*/}{" "}
                <div className={styles.portfolioStats}>
                    <h3>
                        {" "}{userCurrency} {round(totalPrice, 2)}{" "}
                    </h3>
                    <div className={styles.invested}>
                        <p className={investedChange}>
                            {" "}{userCurrency} {investedGainedAmount}({investedGainedPercentage} % ){" "}
                        </p>{" "}
                        <p className={styles.investmentNotes}>
                            (based on investment of {userCurrency} {round(invested, 2)}){" "}
                        </p>{" "}
                    </div>{" "}
                </div>
                {chart}
                {/* Portfolio */} <PortfolioTracker> {itemContainers} </PortfolioTracker>
                {noCoins}{" "}
            </Page>
        );
    }
}

const mapStateToProps = state => ({
    portfolio: state.portfolio,
    auth: state.auth,
    currency: state.currency,
    user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
        portfolioActions: bindActionCreators(PortfolioActions, dispatch),
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioTrackerPage);

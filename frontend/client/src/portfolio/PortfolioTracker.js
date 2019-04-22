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
import PortfolioTrackerItem from "./NewPortfolioTrackerItem";
import Loader from "../components/Loader";
import * as PortfolioHelper from "./PortfolioHelper";
import cx from "classnames";
import pageStyles from "../components/page.scss";
import PortfolioPieChart from "./PortfolioPieChart";

export class PortfolioTracker extends Component {
    render() {
        const children = this.props.children;

        return <div className={styles.portfolio}> {children} </div>;
    }
}

const SORT = {
    NAME: "name",
    PERCENTAGE: "percentage",
    PRICE: "price",
};

class PortfolioTrackerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort: SORT.PRICE,
        };
    }

    componentWillMount() {
        const { currencyActions, userActions, user, portfolioActions } = this.props;

        // load currencies
        if (!this.props.currency.get("loaded")) {
            currencyActions.index();
        }

        if (!user.loaded) {
            userActions.me();
        }

        portfolioActions.retrieve().then(coins => {
            portfolioActions.details(coins);
            portfolioActions.stats(coins);
        });
    }

    componentDidMount() {
        // load portfolio details
        setInterval(this.props.portfolioActions.details, 10000);
        setInterval(this.props.portfolioActions.retrieve, 60000);
    }

    sort = e => {
        this.setState({ sort: e.target.value });
    };

    hasCoins() {
        return this.props.portfolio.details.get("coins").length > 0;
    }

    isLoading() {
        return (
            !this.props.portfolio.coins.get("loaded") ||
            !this.props.portfolio.details.get("loaded") ||
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

    sortItems(items) {
        switch (this.state.sort) {
            case SORT.NAME:
                return items.sort((coinA, coinB) => coinA.name.localeCompare(coinB.name));
            case SORT.PERCENTAGE:
                return items.sort(
                    (coinA, coinB) =>
                        parseFloat(coinB.profitInPercent) - parseFloat(coinA.profitInPercent),
                );
            case SORT.PRICE:
                return items.sort(
                    (coinA, coinB) => coinB.amount * coinB.price - coinA.amount * coinA.price,
                );
            default:
                return items.sort((coinA, coinB) => coinA.name.localeCompare(coinB.name));
        }
    }

    getCurrency(currency) {
        const currencyObj = this.props.currency.items[currency];
        return currencyObj;
    }

    getUserCurrency() {
        const user = this.props.user.get("user").toObject();
        const userCurrency = user.preferences.currency || "USD";
        return this.getCurrency(userCurrency);
    }

    getInitialInvestment() {
        const user = this.props.user.get("user").toObject();
        const userInitialInvestment = user.preferences.initialInvestment || 0;
        return userInitialInvestment;
    }

    portfolioView = () => {
        const initialState = this.props.portfolio;

        // get coins user owns and reduce them
        const portfolio = PortfolioHelper.reduceItems(initialState.coins.get("items"));

        // link the current market value to it
        const linkedPortfolio = PortfolioHelper.linkPortfolioToMarket(
            portfolio,
            initialState.details.get("coins"),
        );

        return PortfolioHelper.portfolioView(
            linkedPortfolio,
            this.getInitialInvestment(),
            this.getUserCurrency(),
            this.props.currency.items,
        );
    };

    renderPortfolioItems(items) {
        const isFetching = this.props.portfolio.page.get("isFetching");
        const stats = this.props.portfolio.stats;

        return items.map(item => {
            const boughtCurrency = this.getCurrency(item.boughtCurrency || "USD");
            return (
                <PortfolioTrackerItem
                    key={item._id}
                    id={item.id}
                    name={item.name}
                    symbol={item.symbol}
                    image={item.image}
                    changeHour={item.changes.percentHour}
                    changeDay={item.changes.percentDay}
                    changeWeek={item.changes.percentWeek}
                    boughtPrice={item.price}
                    currency={this.getUserCurrency()}
                    boughtCurrency={boughtCurrency}
                    price={item.price}
                    amount={item.amount}
                    isUpdating={isFetching}
                    history={item.history}
                    profit={item.profit}
                    profitInPercent={item.profitInPercent}
                    paid={item.paid}
                    stats={stats[item.id]}
                />
            );
        });
    }

    renderChart(items) {
        const data = [];
        for (const key of Object.keys(items)) {
            data.push({
                id: items[key].id,
                name: items[key].symbol,
                symbol: items[key].symbol,
                label: items[key].netWorth,
                total: parseFloat(items[key].amount * items[key].price),
            });
        }

        const chart = this.hasCoins() ? (
            <PortfolioPieChart data={data} customTooltip inPercent={false} />
        ) : (
            undefined
        );

        return chart;
    }

    renderSort() {
        if (!this.hasCoins()) return undefined;

        return (
            <div className={styles.sort}>
                <span>Sort by</span>
                <select onChange={this.sort}>
                    <option value={SORT.PRICE}>Price</option>
                    <option value={SORT.PERCENTAGE}>Percentage</option>
                    <option value={SORT.NAME}>name</option>
                </select>
            </div>
        );
    }

    render() {
        if (this.isLoading())
            return (
                <Page custom className={homeStyles.main}>
                    <Loader />
                </Page>
            );

        // GET USER PORTFOLIO
        const noCoins = !this.hasCoins() ? this.renderNoCoins() : null;
        const view = this.portfolioView();
        const portfolioItemContainers = this.renderPortfolioItems(this.sortItems(view.items));
        const chart = this.renderChart(view.items);
        const sort = this.renderSort();

        // set document title
        AppActions.setDocumentTitle(`${view.netWorthRaw} (${view.profitInPercent}%)`);

        return (
            <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                <div className={styles.portfolioStats}>
                    <div className={styles.portfolioWorth}>
                        <h3
                            className={styles.portfolioTotal}
                            dangerouslySetInnerHTML={{ __html: view.netWorth }}
                        />
                        <div className={styles.invested}>
                            <p
                                className={view.profitStyle}
                                dangerouslySetInnerHTML={{
                                    __html: `${view.profit} (${view.profitInPercent}%)`,
                                }}
                            />
                            <p
                                className={styles.investmentNotes}
                                dangerouslySetInnerHTML={{
                                    __html: `(based on investment of ${view.initialInvestment})`,
                                }}
                            />
                        </div>
                    </div>
                    {chart}
                </div>
                <div className={styles.settings}>{sort}</div>
                <PortfolioTracker> {portfolioItemContainers} </PortfolioTracker>
                {noCoins}
            </Page>
        );
    }
}

const mapStateToProps = state => ({
    portfolio: state.portfolio,
    auth: state.auth,
    currency: state.currency,
    user: state.user,
});

const mapDispatchToProps = dispatch => {
    return {
        portfolioActions: bindActionCreators(PortfolioActions, dispatch),
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PortfolioTrackerPage);

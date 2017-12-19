import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Page from "../components/Page";
import * as ShareActions from "./ShareActions";
import * as CurrencyActions from "../currency/CurrencyActions";
import * as PortfolioActions from "../portfolio/PortfolioActions";
import * as PortfolioHelper from "../portfolio/PortfolioHelper";

import cx from "classnames";
import pageStyles from "../components/page.scss";
import homeStyles from "../app/home.scss";
import styles from "../portfolio/portfolioTracker.scss";

import { PortfolioTracker } from "../portfolio/PortfolioTracker";
import PortfolioTrackerItem from "../portfolio/NewPortfolioTrackerItem";
import PortfolioPieChart from "../portfolio/PortfolioPieChart";
import Loader from "../components/Loader";
import NotFoundPage from "../components/NotFoundPage";
import { round } from "../helpers/MathHelper";
import * as CurrencyHelper from "../helpers/CurrencyHelper";

const SORT = {
    NAME: "name",
    PERCENTAGE: "percentage",
    PRICE: "price",
};

class ShareOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort: SORT.PRICE,
        };
    }

    componentWillMount() {
        const { currencyActions, portfolioActions } = this.props;

        // load currencies
        currencyActions.index();

        this.props.shareActions.loadShare(this.props.routeParams.shareLink);
    }

    componentDidMount() {
        this.props.shareActions.loadShare(this.props.routeParams.shareLink);
    }

    isLoading() {
        const { currencies, share } = this.props;
        return share.coins.get("loaded") || !currencies.loaded || !this.getUserCurrency();
    }

    getCurrency(currency) {
        const currencyObj = this.props.currencies.get("items")[currency];
        return currencyObj;
    }

    getUserCurrency() {
        return this.getCurrency(this.props.share.currency);
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
        return items;
    }

    renderPortfolioItems(items) {
        const isFetching = !this.props.portfolio.stats.get("loaded");

        return items.map((item, i) => {
            const boughtCurrency = item.boughtCurrency || this.getCurrency("USD");
            return (
                <PortfolioTrackerItem
                    key={i}
                    id={item.id}
                    name={item.name}
                    symbol={item.symbol}
                    changeHour={item.changes.percent_1h}
                    changeDay={item.changes.percent_24h}
                    changeWeek={item.changes.percent_7d}
                    boughtPrice={item.price}
                    currency={this.props.currencies.get("items")[this.props.share.currency]}
                    boughtCurrency={boughtCurrency}
                    price={item.price}
                    amount={item.amount}
                    isUpdating={isFetching}
                    history={item.history}
                    profit={item.profit}
                    profitInPercent={item.profitInPercent}
                    paid={item.paid}
                    settings={this.props.share.settings}
                />
            );
        });
    }

    notFoundPage() {
        return (
            <NotFoundPage
                title="Portfolio not found"
                text="We could not find the portfolio you were looking for"
                className={pageStyles.shareNotFoundPage}
            />
        );
    }

    loadingPage() {
        return (
            <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                <Loader />
            </Page>
        );
    }

    portfolioView = () => {
        const initialState = this.props.portfolio;
        const portfolio = this.props.share.coins.get("items").toObject();

        // // link the current market value to it
        const currencyObj = this.getUserCurrency();
        Object.keys(portfolio).forEach(key => {
            portfolio[key].market = portfolio[key].details;
        });
        return PortfolioHelper.portfolioView(
            portfolio,
            0,
            currencyObj,
            this.props.currencies.items,
        );
    };

    renderChart(items) {
        if (!this.props.share.settings.chart) {
            return undefined;
        }
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

        const chart = <PortfolioPieChart data={data} customTooltip inPercent={false} />;

        return chart;
    }

    render() {
        const { currencies, share } = this.props;

        if (share.notFound) {
            return this.notFoundPage();
        }

        if (this.isLoading()) {
            return this.loadingPage();
        }

        const view = this.portfolioView();
        const portfolioItemContainers = this.renderPortfolioItems(this.sortItems(view.items));
        const chart = this.renderChart(view.items);
        const total =
            this.props.share.settings.price && this.props.share.settings.amount ? (
                <h3
                    className={styles.portfolioTotal}
                    dangerouslySetInnerHTML={{ __html: view.netWorth }}
                />
            ) : (
                undefined
            );

        return (
            <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                <div className={styles.portfolioStats}>
                    {total}
                    {chart}
                </div>
                <div className={styles.settings}>
                    <div className={styles.sort}>
                        <span>Sort by</span>
                        <select onChange={this.sort}>
                            <option value={SORT.PRICE}>Price</option>
                            <option value={SORT.PERCENTAGE}>Percentage</option>
                            <option value={SORT.NAME}>name</option>
                        </select>
                    </div>
                </div>
                <PortfolioTracker> {portfolioItemContainers} </PortfolioTracker>
            </Page>
        );
    }
}

const mapStateToProps = state => ({
    share: state.share,
    currencies: state.currency,
    portfolio: state.portfolio,
});

const mapDispatchToProps = dispatch => {
    return {
        shareActions: bindActionCreators(ShareActions, dispatch),
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        portfolioActions: bindActionCreators(PortfolioActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareOverview);

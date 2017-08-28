import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Page from "../components/Page";
import * as ShareActions from "./ShareActions";
import * as CurrencyActions from "../currency/CurrencyActions";

import cx from "classnames";
import pageStyles from "../components/page.scss";
import homeStyles from "../app/home.scss";

import { PortfolioTracker } from "../portfolio/PortfolioTracker";
import PortfolioTrackerItem from "../portfolio/PortfolioTrackerItem";
import PortfolioPieChart from "../portfolio/PortfolioPieChart";
import Loader from "../components/Loader";
import NotFoundPage from "../components/NotFoundPage";
import { round, gained } from "../helpers/MathHelper";

class ShareOverview extends Component {
    componentWillMount() {
        const { currencyActions, shareActions } = this.props;

        // load currencies
        currencyActions.index();
    }

    componentDidMount() {
        this.props.shareActions.loadShare(this.props.routeParams.shareLink);
    }

    render() {
        const { currencies, share } = this.props;

        if (share.notFound) {
            return (
                <NotFoundPage
                    title="Portfolio not found"
                    text="We could not find the portfolio you were looking for"
                    className={pageStyles.shareNotFoundPage}
                />
            );
        }

        if (share.coins.get("isLoading") || currencies.loading) {
            return (
                <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                    <Loader />
                </Page>
            );
        }

        const coins = share.coins.get("items").toObject();
        const settings = share.settings;
        const currency = share.currency;
        const rate = currencies.rates[currency];

        let chartData = [];

        const items = Object.entries(coins).map(([ key, val ]) => {
            if (!val.details) {
                return undefined;
            }

            if (val.amount) {
                let total =
                    settings.amount && settings.price
                        ? parseFloat(val.amount ? round(val.amount * val.details.price.usd, 2) : undefined)
                        : parseFloat(round(val.amount * 100, 2));

                chartData.push({
                    id: val.coinId,
                    symbol: val.details.symbol,
                    name: val.details.symbol,
                    total: total,
                    label: settings.amount && settings.price ? `USD ${total}` : `${total}%`
                });
            }

            const changes = settings.change
                ? {
                      changeHour: val.details.change.percent_1h,
                      changeDay: val.details.change.percent_24h,
                      changeWeek: val.details.change.percent_7d
                  }
                : null;

            return (
                <PortfolioTrackerItem
                    key={val.details.coin_id}
                    id={val.details.coin_id}
                    name={val.details.name}
                    symbol={val.details.symbol}
                    price={val.details.price.usd}
                    amount={val.amount ? val.amount : undefined}
                    currency={currency}
                    settings={settings}
                    boughtPrice={val.boughtPrice}
                    rate={rate}
                    {...changes}
                />
            );
        });

        const chart =
            chartData.length > 0 && settings.graph ? <PortfolioPieChart data={chartData} customTooltip /> : undefined;

        return (
            <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                {chart}
                <PortfolioTracker>{items}</PortfolioTracker>
            </Page>
        );
    }
}

const mapStateToProps = (state) => ({
    share: state.share,
    currencies: state.currency
});

const mapDispatchToProps = (dispatch) => {
    return {
        shareActions: bindActionCreators(ShareActions, dispatch),
        currencyActions: bindActionCreators(CurrencyActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareOverview);

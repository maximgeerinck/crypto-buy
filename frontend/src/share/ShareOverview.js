import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Page from "../components/Page";
import * as ShareActions from "./ShareActions";

import cx from "classnames";
import pageStyles from "../components/page.scss";
import homeStyles from "../app/home.scss";

import { PortfolioTracker } from "../portfolio/PortfolioTracker";
import PortfolioTrackerItem from "../portfolio/PortfolioTrackerItem";
import PortfolioPieChart from "../portfolio/PortfolioPieChart";
import Loader from "../components/Loader";
import NotFoundPage from "../components/NotFoundPage";

class ShareOverview extends Component {
    componentDidMount() {
        this.props.shareActions.loadShare(this.props.routeParams.shareLink);
    }

    render() {
        if (this.props.share.notFound) {
            return (
                <NotFoundPage
                    title="Portfolio not found"
                    text="We could not find the portfolio you were looking for"
                    className={pageStyles.shareNotFoundPage}
                />
            );
        }

        if (this.props.share.coins.get("isLoading")) {
            return (
                <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                    <Loader />
                </Page>
            );
        }

        const coins = this.props.share.coins.get("items").toObject();
        const settings = this.props.share.settings;

        let chartData = [];

        const items = Object.entries(coins).map(([ key, val ]) => {
            if (!val.details) {
                return undefined;
            }

            if (val.amount) {
                chartData.push({
                    symbol: val.details.symbol,
                    total: parseFloat(val.amount ? val.amount * val.details.price.usd : undefined)
                });
            }

            const changes = settings.change
                ? {
                      changeHour: val.details.change.percentHour,
                      changeDay: val.details.change.percentDay,
                      changeWeek: val.details.change.percentWeek,
                      changeTotal: val.details.change.percentDay
                  }
                : null;

            return (
                <PortfolioTrackerItem
                    key={val.details.id}
                    id={val.details.id}
                    name={val.details.name}
                    symbol={val.details.name}
                    price={val.details.price.usd}
                    amount={val.amount ? val.amount : undefined}
                    currency="USD"
                    showStatistics={true}
                    showChange={settings.change}
                    showPrice={settings.price}
                    {...changes}
                />
            );
        });

        const chart = chartData.length > 0 && settings.graph ? <PortfolioPieChart data={chartData} /> : undefined;

        return (
            <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
                {chart}
                <PortfolioTracker>{items}</PortfolioTracker>
            </Page>
        );
    }
}

const mapStateToProps = (state) => ({
    share: state.share
});

const mapDispatchToProps = (dispatch) => {
    return {
        shareActions: bindActionCreators(ShareActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareOverview);

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

class ShareOverview extends Component {
    componentDidMount() {
        this.props.shareActions.loadPortfolio(this.props.routeParams.shareLink);
    }

    render() {
        const coins = this.props.share.coins.get("items").toObject();

        const items = Object.entries(coins).map(([ key, val ]) => {
            console.log(val.amount);
            return val.details ? (
                <PortfolioTrackerItem
                    key={val.details.id}
                    id={val.details.id}
                    name={val.details.name}
                    symbol={val.details.name}
                    changeHour={val.details.change.percentHour}
                    changeDay={val.details.change.percentDay}
                    changeWeek={val.details.change.percentWeek}
                    price={val.details.price.usd}
                    amount={val.amount ? val.amount * val.details.price.usd : undefined}
                    currency="USD"
                    showStatistics={true}
                    changeTotal={val.details.change.percentDay}
                />
            ) : null;
        });

        return (
            <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
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

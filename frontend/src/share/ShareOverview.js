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
        const items = this.props.share.coins.get("items").map((item) => {
            return <PortfolioTrackerItem {...item} showStatistics={false} changeTotal={item.change.percentDay} />;
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

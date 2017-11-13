import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ShareActions from "../share/ShareActions";
import * as UserActions from "./UserActions";
import styles from "./share.scss";

import Loader from "../components/Loader";
import ShareItem from "./ShareItem";
import ShareForm from "./ShareForm";
import * as PortfolioActions from "../portfolio/PortfolioActions";
import * as CoinActions from "../coin/CoinActions";
import * as PortfolioHelper from "../helpers/PortfolioHelper";

class SharePortfolio extends Component {

  componentWillMount() {
    this.props.portfolioActions.retrieve();
    this.props.coinActions.retrieve();
  }

  isLoading() {
    return !this.props.portfolio.coins.get("loaded") || !this.props.coins.get("loaded");
  }

  share = (options) => {
    const user = this.props.user.get("user").toObject();
    this.props.shareActions.share(options, user.preferences.currency);
  };

  deleteShare = (id) => this.props.shareActions.deleteShare(id);

  render() {
    if (this.isLoading()) {
      return <Loader/>;
    }

    const shares = this.props.user.get("user").get("shares");
    const bound = PortfolioHelper.bindPortfolioToCoin(this.props.portfolio.coins.get("items"), this.props.coins.coins.toObject());

    let shareContainers = shares.map((share) => {
      const permissions = Object.keys(share).filter((key) => typeof share[key] === "boolean" && share[key]);
      return (
        <ShareItem
            key={share.id}
            id={share.id}
            permissions={permissions}
            token={share.token}
            onDelete={this.deleteShare}
            onCopy={this.copyShare}
            items={bound}
        />
      );
    });

    return (
      <div>
          <ShareForm onSave={this.share} latestShare={this.props.share.latestShare} />

          <h2>Items</h2>          

          <h3>Your active share links</h3>
          <ul className={styles.shares}>{shareContainers}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  share: state.share,
  portfolio: state.portfolio,
  coins: state.coins
});

const mapDispatchToProps = (dispatch) => {
  return {
    shareActions: bindActionCreators(ShareActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch),
    portfolioActions: bindActionCreators(PortfolioActions, dispatch),
    coinActions: bindActionCreators(CoinActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePortfolio);
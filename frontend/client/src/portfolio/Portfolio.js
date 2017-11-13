import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as PortfolioActions from "./PortfolioActions";
import * as CoinActions from "../coin/CoinActions";
import styles from "./portfolio.scss";
import PortfolioItem from "./PortfolioItem";
import Loader from "../components/Loader";

class Portfolio extends Component {
  componentWillMount() {
    this.props.portfolioActions.retrieve();
    this.props.coinActions.retrieve();
  }

  onDelete = (id) => {
    this.props.portfolioActions.removeCoin(id);
  };

  renderNonAutomatic() {
    const coins = this.props.portfolio.coins.get("items");

    return coins.filter((coin) => coin.automatic !== true).map((i, key) => {
      const validationErrors = this.props.portfolio.coins.get("validationErrors")[key];
      return (
        <PortfolioItem
          key={i.id}
          coin={i}
          details={this.props.coins.coins.toObject()[i.coinId]}
          onEdit={(coin) => this.props.portfolioActions.updateCoin(key, i)}
          onDelete={() => this.onDelete(i.id)}
          validationErrors={validationErrors}
          editMode={false}
        />
      );
    });

  }
  renderAutomatic() {
    const coins = this.props.portfolio.coins.get("items");

    return coins.filter((coin) => coin.automatic === true).map((i, key) => {
      const validationErrors = this.props.portfolio.coins.get("validationErrors")[key];
      return (
        <PortfolioItem
                  key={i.id}
                  coin={i}
                  details={this.props.coins.coins.toObject()[i.coinId]}
                  validationErrors={validationErrors}
                  editMode={false}
              />
      );
    });

  }

  isLoading() {
    return !this.props.portfolio.coins.get("loaded") || !this.props.coins.get("loaded");
  }

  render() {
    if (this.isLoading()) {
      return <Loader />;
    }

    const components = [];

    // non automatic containers
    components.push(this.renderNonAutomatic());

    // render automatic containers
    const automaticComponents = this.renderAutomatic();
    if (automaticComponents.length > 0) {
      components.push(<div className={styles.automatic}>{automaticComponents}<p className={styles.source}>Automatically added from bittrex.com</p></div>);
    }


    return <div className={styles.portfolio}>{components}</div>;
  }
}

const mapStateToProps = (state) => ({
  portfolio: state.portfolio,
  coins: state.coins
});

const mapDispatchToProps = (dispatch) => {
  return {
    portfolioActions: bindActionCreators(PortfolioActions, dispatch),
    coinActions: bindActionCreators(CoinActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
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
        if (!this.props.coins.loaded) {
            this.props.coinActions.retrieve();
        }
    }

    onDelete = id => {
        this.props.portfolioActions.removeCoin(id);
    };

    isLoading() {
        return !this.props.portfolio.coins.get("loaded") || !this.props.coins.get("loaded");
    }

    renderCoins(automatic) {
        const coins = this.props.portfolio.coins.get("items");

        console.log(coins["iota"]);
        console.log(coins["ethereum"]);
        console.log(this.props.coins.coins.toObject());
        return coins
            .filter(coin => coin.automatic === automatic)
            .map((i, key) => {
                const validationErrors = this.props.portfolio.coins.get("validationErrors")[key];
                return (
                    <PortfolioItem
                        coin={i}
                        details={this.props.coins.coins.toObject()[i.coinId]}
                        onEdit={coin => this.props.portfolioActions.updateCoin(key, coin)}
                        onDelete={!automatic ? () => this.onDelete(i.id) : undefined}
                        validationErrors={validationErrors}
                        editMode={false}
                    />
                );
            });
    }

    renderNonAutomatic() {
        return this.renderCoins(false);
    }
    renderAutomatic() {
        return this.renderCoins(true);
    }

    render() {
        if (this.isLoading()) {
            return <Loader />;
        }

        const components = [];

        // non automatic containers
        components.push(...this.renderNonAutomatic());

        // render automatic containers
        const automaticComponents = this.renderAutomatic();
        if (automaticComponents.length > 0) {
            components.push(
                <div className={styles.automatic} key="bittrex-api">
                    {automaticComponents}
                    <p className={styles.source}>Automatically added from bittrex.com</p>
                </div>,
            );
        }

        console.log(components);
        return <ul className={styles.portfolio}>HI{components}</ul>;
    }
}

const mapStateToProps = state => ({
    portfolio: state.portfolio,
    coins: state.coins,
});

const mapDispatchToProps = dispatch => {
    return {
        portfolioActions: bindActionCreators(PortfolioActions, dispatch),
        coinActions: bindActionCreators(CoinActions, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Portfolio);

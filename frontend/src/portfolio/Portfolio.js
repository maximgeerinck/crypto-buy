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

    onDelete = id => {
        this.props.portfolioActions.removeCoin(id);
    };

    render() {
        if (this.props.portfolio.coins.get("loading") || this.props.coins.get("isLoading")) {
            return <Loader />;
        }

        const coins = this.props.portfolio.coins.get("items");
        const coinContainers = coins.map((i, key) => {
            const validationErrors = this.props.portfolio.coins.get("validationErrors")[key];
            return (
                <PortfolioItem
                    key={i.id}
                    coin={i}
                    details={this.props.coins.coins.toObject()[i.coinId]}
                    onEdit={coin => this.props.portfolioActions.updateCoin(key, coin)}
                    onDelete={() => this.onDelete(i.id)}
                    validationErrors={validationErrors}
                    editMode={false}
                />
            );
        });

        return (
            <div className={styles.portfolio}>
                {coinContainers}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    portfolio: state.portfolio,
    coins: state.coins
});

const mapDispatchToProps = dispatch => {
    return {
        portfolioActions: bindActionCreators(PortfolioActions, dispatch),
        coinActions: bindActionCreators(CoinActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as PortfolioActions from "./PortfolioActions";
import CoinForm from "./CoinForm";
import moment from "moment";
import formStyles from "../forms.scss";

class AddPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    onSubmit = coin => {
        this.props.portfolioActions.addCoins([coin]).then(success => {
            if (success) {
                this.setState(this.getInitialState());
            }
        });
    };

    getInitialState() {
        const initialState = {
            coin: {
                coinId: undefined,
                amount: undefined,
                boughtPrice: undefined,
                source: undefined,
                boughtAt: moment()
            },
            showForm: false
        };
        return initialState;
    }

    onChange = coin => {
        this.setState({ coin: coin });
    };

    showForm = () => {
        this.setState({ showForm: true });
    };

    render() {
        const { showForm, coin } = this.state;

        if (!showForm) {
            return (
                <div>
                    <button onClick={this.showForm} className={formStyles.button}>
                        Add a new coin
                    </button>
                </div>
            );
        }

        return (
            <CoinForm
                coin={coin}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                validationErrors={this.props.portfolio.form.get("errors")}
            />
        );
    }
}

const mapStateToProps = state => ({
    portfolio: state.portfolio,
    user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
        portfolioActions: bindActionCreators(PortfolioActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPortfolio);

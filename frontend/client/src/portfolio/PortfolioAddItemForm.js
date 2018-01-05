import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as PortfolioActions from "./PortfolioActions";
import * as CurrencyActions from "../currency/CurrencyActions";
import CoinForm from "./CoinForm";
import moment from "moment";
import formStyles from "../forms.scss";
import pageStyle from "../components/page.scss";
import Loader from "../components/Loader";

class AddPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

  onSubmit = coin => {
      this.props.portfolioActions.addCoins([coin]).then(success => {
          if (success) {
              setTimeout(() => {
                  this.setState(this.getInitialState());
              }, 1500);
              this.setState({ success: true });
          }
      });
  };

  componentWillMount() {
      if (!this.props.currency.get("loaded")) {
      // load currencies
          this.props.currencyActions.index();
      }
  }

  getInitialState() {
      const initialState = {
          coin: {
              coinId: undefined,
              amount: undefined,
              boughtPrice: undefined,
              currency: undefined,
              source: undefined,
              boughtAt: moment()
          },
          showForm: true,
          success: false
      };
      return initialState;
  }

  onChange = coin => {
      this.setState({ coin: coin });
  };

  showForm = () => {
      this.setState({ showForm: true });
  };

  renderSuccess() {
      return (
        <div className={pageStyle.container}>
            <p>Your coin has been added to your portfolio!</p>
          </div>
      );
  }

  render() {
      const { showForm, coin, success } = this.state;

      if (!this.props.currency.loaded) {
          return <Loader />;
      }

      const user = this.props.user.get("user").toObject();

      if (success) {
          return this.renderSuccess();
      }

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
            defaultCurrency={user.preferences.currency}
            validationErrors={this.props.portfolio.form.get("errors")}
          />
      );
  }
}

const mapStateToProps = state => ({
    portfolio: state.portfolio,
    user: state.user,
    currency: state.currency
});

const mapDispatchToProps = dispatch => {
    return {
        portfolioActions: bindActionCreators(PortfolioActions, dispatch),
        currencyActions: bindActionCreators(CurrencyActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPortfolio);

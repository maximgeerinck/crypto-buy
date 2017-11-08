import React, { Component } from "react";
import * as CurrencyActions from "./CurrencyActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Loader from "../components/Loader";
import Select from "react-select";
import "react-select/dist/react-select.css";
import "../react-select.css";

class CurrencyChooser extends Component {
  componentWillMount() {
    // load currencies
    this.props.currencyActions.index();
  }

  render() {
    const { currencies, currency, className } = this.props;

    if (currencies.loading) return <Loader />;

    const rates = Object.keys(currencies.items).map((currency) => {
      const c = currencies.items[currency];
      return { value: currency, label: c.name };
    });

    return (
      <Select
                name="currency"
                className={className}
                value={currency}
                options={rates}
                onChange={(val) => this.props.onSave(val.value)}
            />
    );
  }
}

const mapStateToProps = (state) => ({
  currencies: state.currency
});

const mapDispatchToProps = (dispatch) => {
  return {
    currencyActions: bindActionCreators(CurrencyActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyChooser);
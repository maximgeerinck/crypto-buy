import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CurrencyChooser from '../currency/CurrencyChooser';
import formStyles from '../forms.scss';
import debounce from 'debounce';

class UserCurrencyPreference extends Component {
  render() {
    return (
      <CurrencyChooser {...this.props}/>
    );
  }
}

UserCurrencyPreference.propTypes = {
  currency: PropTypes.string,
  onSave: PropTypes.func
};

class UserPreferences extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialInvestment: props.initialInvestment
    }
  }

  componentWillMount() {
    this.delayedCallback = debounce(e => {
      this.props.onSave({ initialInvestment: e.target.value })
    }, 500);
  }

  _onChangeInvestment = e => {
    e.persist();
    this.setState({ initialInvestment: e.target.value });
    this.delayedCallback(e);
    // debounce(this.props.onSave({ initialInvestment: e.target.value }), 1000);
  }

  render() {
    const { currency } = this.props;
    const { initialInvestment } = this.state;
    return (
      <form className={formStyles.form}>
        <div className={formStyles.group}>
          <label htmlFor="currency">Prefered currency</label>
          <UserCurrencyPreference
            currency={currency}
            id="currency"
            className={formStyles.input}
            onSave={preference => this.props.onSave({ currency: preference })}
          />
          <span className={formStyles.descriptor}>Which currency would you like your dashboard to be displayed in?</span>
        </div>
        <div className={formStyles.group}>
          <label htmlFor="initialInvestment">Initial investment</label>
          <input type="number" placeholder="0.00" value={initialInvestment} id="initialInvestment" onChange={this._onChangeInvestment}/>
          <span className={formStyles.descriptor}>Here you can enter a total initial investment if you don't remember the amount spend per coin (if this is > 0, then the price per coin will be ignored)</span>
        </div>
      </form>
    );
  }
}

UserPreferences.propTypes = {
  currency: PropTypes.string,
  onSave: PropTypes.func
};

export default UserPreferences;
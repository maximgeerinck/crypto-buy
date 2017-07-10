import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PortfolioActions from './PortfolioActions';
import PropTypes from 'prop-types';
import formStyles from '../forms.scss';
import Loader from '../components/Loader';
import ValidationHelper from '../helpers/ValidationHelper';

class PortfolioItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      amount: undefined,
      boughtPrice: undefined,
      source: undefined,
      boughtAt: undefined
    };
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { symbol, amount, boughtPrice, source, boughtAt } = this.state;
    const { isSubmitting } = this.props;

    const buttonText = isSubmitting ? <Loader style={{ transform: 'scale(0.9)' }} /> : 'Add coin';

    const showPricePerCoin = this.props.initialInvestment > 0 ? { display: 'none' } : null;
    const validation = this.props.validationErrors || {};

    return (
      <form className={formStyles.form} onSubmit={this.onSubmit}>
        <div className={formStyles.group}>
          <label htmlFor="symbol">Symbol:</label>
          <input
            type="text"
            id="symbol"
            placeholder="ETH"
            value={symbol}
            onChange={e => this.setState({ symbol: e.target.value })}
          />
          <span className={formStyles.validationError}>
            {ValidationHelper.parse(validation.symbol, ['Symbol'])}
          </span>
        </div>
        <div className={formStyles.group}>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            placeholder="0.00"
            value={amount}
            onChange={e => this.setState({ amount: e.target.value })}
          />
          <span className={formStyles.validationError}>
            {ValidationHelper.parse(validation.amount, ['Amount'])}
          </span>
        </div>
        <div className={formStyles.group} style={showPricePerCoin}>
          <label htmlFor="price">Price you bought 1 coin for:</label>
          <input
            type="number"
            id="price"
            placeholder="0.00"
            value={boughtPrice}
            onChange={e => this.setState({ boughtPrice: e.target.value })}
          />
          <span className={formStyles.validationError}>
            {ValidationHelper.parse(validation.boughtPrice, ['Purchase price'])}
          </span>
        </div>
        <div className={formStyles.group}>
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            placeholder="gdax.com"
            value={source}
            onChange={e => this.setState({ source: e.target.value })}
          />
          <span className={formStyles.validationError}>
            {ValidationHelper.parse(validation.source, ['Source'])}
          </span>
        </div>
        <div className={formStyles.group}>
          <label htmlFor="purchase_date">Purchase Date:</label>
          <input
            type="datetime-local"
            id="purchase_date"
            placeholder="04-02-2017"
            value={boughtAt}
            onChange={e => this.setState({ boughtAt: e.target.value })}
          />
          <span className={formStyles.validationError}>
            {ValidationHelper.parse(validation.boughtAt, ['Purchase date'])}
          </span>
        </div>
        <div className={formStyles.group}>
          <button type="submit" className={formStyles.button}>
            {buttonText}
          </button>
        </div>
      </form>
    );
  }
}

PortfolioItemForm.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  validationErrors: PropTypes.object,
  initialInvestment: PropTypes.number
};

class AddPortfolio extends Component {
  onSubmit = coin => {
    this.props.portfolioActions.addCoins([coin]);
  };

  render() {
    return (
      <div>
        <PortfolioItemForm 
          onSubmit={this.onSubmit} 
          isSubmitting={this.props.portfolio.form.get('isSubmitting')}
          validationErrors={this.props.portfolio.form.get('errors')}
          initialInvestment={this.props.user.user.preferences.initialInvestment}/>
      </div>
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
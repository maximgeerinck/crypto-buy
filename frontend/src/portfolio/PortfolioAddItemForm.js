import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PortfolioActions from './PortfolioActions';
import PropTypes from 'prop-types';
import formStyles from '../forms.scss';
import Loader from '../components/Loader';

class PortfolioItemForm extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   name: undefined,
    //   amount: undefined,
    //   boughtPrice: undefined,
    //   source: undefined,
    //   boughtAt: undefined
    // };
    this.state = {
      symbol: 'BNT',
      amount: 1000,
      boughtPrice: 1,
      source: 'liqui.io',
      boughtAt: '2017-06-28T10:10'
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
        </div>
        <div className={formStyles.group}>
          <label htmlFor="price">Price you bought 1 coin for:</label>
          <input
            type="number"
            id="price"
            placeholder="0.00"
            value={boughtPrice}
            onChange={e => this.setState({ boughtPrice: e.target.value })}
          />
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
  isSubmitting: PropTypes.bool
};

class AddPortfolio extends Component {
  onSubmit = coin => {
    this.props.portfolioActions.addCoins([coin]);
  };

  render() {
    console.log('rendering');
    return (
      <div>
        <PortfolioItemForm onSubmit={this.onSubmit} isSubmitting={this.props.portfolio.form.get('isSubmitting')} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  portfolio: state.portfolio
});

const mapDispatchToProps = dispatch => {
  return {
    portfolioActions: bindActionCreators(PortfolioActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPortfolio);
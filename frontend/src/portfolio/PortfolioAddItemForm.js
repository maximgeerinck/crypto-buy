import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PortfolioActions from './PortfolioActions';
import CoinForm from './CoinForm';
import moment from 'moment';

class AddPortfolio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coin: {
        symbol: undefined,
        amount: undefined,
        boughtPrice: undefined,
        source: undefined,
        boughtAt: moment()
      }
    }
  }

  onSubmit = coin => {
    this.props.portfolioActions.addCoins([coin]);
  };

  onChange = coin => {
    this.setState({ coin: coin });
  }

  render() {
    return (
      <CoinForm coin={this.state.coin} onChange={this.onChange} onSubmit={this.onSubmit} validationErrors={this.props.portfolio.form.get('errors')} />
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
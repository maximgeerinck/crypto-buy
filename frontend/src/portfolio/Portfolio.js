import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PortfolioActions from './PortfolioActions';
import styles from './portfolio.scss';
import PortfolioItem from './PortfolioItem';
import moment from 'moment';
import Loader from '../components/Loader';

class Portfolio extends Component {
  componentWillMount() {
    this.props.portfolioActions.retrieve();
  }

  onDelete = id => {
    this.props.portfolioActions.removeCoin(id);
  };

  render() {
    if (this.props.portfolio.coins.get('loading')) return <Loader />;

    const coins = this.props.portfolio.coins.get('items');

    const coinContainers = coins.map((i, key) => {
      return (
        <PortfolioItem
          id={i._id}
          key={key}
          symbol={i.symbol}
          amount={i.amount}
          boughtPrice={i.boughtPrice}
          source={i.source}
          boughtAt={moment(i.boughtAt).format('YYYY-MM-DDTHH:mm:ss')} // '2017-10-10T10:12'
          onEdit={coin => this.props.portfolioActions.updateCoin(coin)}
          onDelete={() => this.onDelete(i._id)}
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
  portfolio: state.portfolio
});

const mapDispatchToProps = dispatch => {
  return {
    portfolioActions: bindActionCreators(PortfolioActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);

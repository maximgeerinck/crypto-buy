import React, { Component } from 'react';
import styles from './portfolio.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import formStyles from '../forms.scss';
import moment from 'moment';
import ValidationHelper from '../helpers/ValidationHelper';

class PortfolioItemEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: props.symbol,
      amount: props.amount,
      boughtPrice: props.boughtPrice,
      source: props.source,
      boughtAt: props.boughtAt,
      id: props.id
    };
  }

  onSave = e => {
    e.preventDefault();
    this.props.onSave(this.state);
  };

  render() {
    const { onCancel } = this.props;
    const { symbol, amount, boughtPrice, source, boughtAt } = this.state;

    const validation = this.props.validationErrors || {};

    return (
      <div style={{ width: '100%' }}>
        <div className={styles.details}>
          <span className={styles.name}>{symbol}</span> <span className={styles.amount}>({amount})</span>
        </div>
        <form className={cx(formStyles.form, styles.addForm)} onSubmit={this.onSave}>
          <div className={formStyles.group}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              placeholder="ETH"
              value={symbol}
              onChange={e => this.setState({ symbol: e.target.value.toUpperCase() })}
            />
            <span className={formStyles.validationError}>
              {ValidationHelper.parse(validation.name, ['name'])}
            </span>
          </div>
          <div className={formStyles.group}>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              step="any"
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={e => this.setState({ amount: e.target.value })}
            />
            <span className={formStyles.validationError}>
              {ValidationHelper.parse(validation.amount, ['amount'])}
            </span>
          </div>
          <div className={formStyles.group}>
            <label htmlFor="price">Price you bought 1 coin for:</label>
            <input
              type="number"
              step="any"
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
          </div>
          <div className={formStyles.group}>
            <label htmlFor="purchase_date">Purchase Date:</label>
            <input
              type="datetime-local"
              id="purchase_date"
              placeholder="04-02-2017 12:20"
              value={boughtAt}
              onChange={e => this.setState({ boughtAt: moment(e.target.value).format('YYYY-MM-DDTHH:mm:ss') })}
            />
            <span className={formStyles.validationError}>
              {ValidationHelper.parse(validation.boughtAt, ['Purchase date'])}
            </span>
          </div>
          <div className={formStyles.group}>
            <button type="submit" className={formStyles.button}>
              Save changes
            </button>
          </div>
          <div className={formStyles.group}>
            <button onClick={onCancel} className={cx(formStyles.button, formStyles.danger)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

PortfolioItemEditForm.propTypes = {
  id: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  boughtPrice: PropTypes.number,
  boughtAt: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  validationErrors: PropTypes.object
};

PortfolioItemEditForm.defaultProps = {
  symbol: '',
  amount: 0,
  boughtPrice: 0,
  boughtAt: Date.now(),
  source: '',
  validationErrors: {}
};

export default PortfolioItemEditForm;
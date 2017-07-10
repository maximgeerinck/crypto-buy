import React, { Component } from 'react';
import styles from './portfolio.scss';
import { MdEdit, MdDelete } from 'react-icons/lib/md';
import PropTypes from 'prop-types';
import PortfolioItemEditForm from './PortfolioItemEditForm';

class PortfolioItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false
    };
  }

  onEdit = item => {
    this.props.onEdit(item);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.validationErrors) {
      this.setState({ editMode: true });
    } else if (this.state.editMode) {
      this.setState({ editMode: false });
    }
  }

  render() {
    const { id, symbol, amount, boughtPrice, source, boughtAt, onDelete, validationErrors } = this.props;

    if (this.state.editMode) {
      return (
        <div className={styles.item}>
          <PortfolioItemEditForm
            id={id}
            symbol={symbol}
            amount={amount}
            boughtPrice={boughtPrice}
            source={source}
            boughtAt={boughtAt}
            onCancel={() => this.setState({ editMode: false })}
            onSave={this.onEdit}
            validationErrors={validationErrors}
          />
        </div>
      );
    }

    return (
      <div className={styles.item}>
        <div className={styles.details}>
          {/*<img src={getCoinImage(name)} alt="Coin image" />*/}
          <span className={styles.name}>{symbol}</span> <span className={styles.amount}>({amount})</span>
        </div>
        <ul className={styles.actions}>
          <li>
            <button onClick={() => this.setState({ editMode: true })}>
              <MdEdit />
            </button>
          </li>
          <li>
            <button className={styles.deleteButton} onClick={() => onDelete()}>
              <MdDelete />
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

PortfolioItem.propTypes = {
  id: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  boughtPrice: PropTypes.number,
  boughtAt: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

PortfolioItem.defaultProps = {
  symbol: '',
  amount: 0,
  boughtPrice: 0,
  boughtAt: Date.now,
  source: ''
};

export default PortfolioItem;
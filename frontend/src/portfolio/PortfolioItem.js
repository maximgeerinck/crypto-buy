import React, { Component } from "react";
import styles from "./portfolio.scss";
import { MdEdit, MdDelete } from "react-icons/lib/md";
import PropTypes from "prop-types";
import CoinForm from "./CoinForm";

class PortfolioItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            coin: props.coin
        };
    }

    onEdit = (item) => {
        this.props.onEdit(item);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.validationErrors) {
            this.setState({ editMode: true });
        } else if (this.state.editMode) {
            this.setState({ editMode: false });
        }
    }

    onChange = (coin) => {
        this.setState({ coin: coin });
    };

    render() {
        const { onDelete, validationErrors } = this.props;
        const { coin, editMode } = this.state;

        const editForm = this.state.editMode
            ? <CoinForm
                  coin={coin}
                  editMode={editMode}
                  onSubmit={this.onEdit}
                  onChange={this.onChange}
                  onCancel={() => this.setState({ editMode: false })}
                  validationErrors={validationErrors}
              />
            : null;

        return (
            <div className={styles.item}>
                <div className={styles.itemHeader}>
                    <div className={styles.details}>
                        {/*<img src={getCoinImage(name)} alt="Coin image" />*/}
                        <span className={styles.name}>{coin.symbol}</span>{" "}
                        <span className={styles.amount}>({coin.amount})</span>
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
                {editForm}
            </div>
        );
    }
}

PortfolioItem.propTypes = {
    coin: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
};

export default PortfolioItem;

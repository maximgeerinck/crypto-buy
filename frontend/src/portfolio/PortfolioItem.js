import React, { Component } from "react";
import styles from "./portfolio.scss";
import { MdEdit, MdDelete } from "react-icons/lib/md";
import PropTypes from "prop-types";
import CoinForm from "./CoinForm";
import { getCoinImage } from "../helpers/CoinHelper";

class PortfolioItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: props.editMode,
            coin: props.coin
        };
    }

    onEdit = item => {
        this.props.onEdit(item).then(success => {
            if (success) {
                this.setState({ editMode: false });
            }
        });
    };

    onChange = coin => {
        this.setState({ coin: coin });
    };

    render() {
        const { onDelete, validationErrors, details } = this.props;
        const { coin, editMode } = this.state;

        if (!details) {
            return <div />;
        }

        const image = coin.coinId
            ? <img src={getCoinImage(coin.coinId)} alt="Coin image" className={styles.image} />
            : null;

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
                        {image}
                        <div className={styles.nameContainer}>
                            <span className={styles.name}>
                                {details.name} ({details.symbol})
                            </span>{" "}
                            <span className={styles.amount}>({coin.amount})</span>
                        </div>
                    </div>
                    <ul className={styles.actions}>
                        <li key="edit">
                            <button onClick={() => this.setState({ editMode: true })}>
                                <MdEdit />
                            </button>
                        </li>
                        <li key="delete">
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
    onEdit: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired
};

export default PortfolioItem;

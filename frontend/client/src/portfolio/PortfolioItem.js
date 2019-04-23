import React, { Component } from "react";
import styles from "./portfolio.scss";
import FontAwesome from "react-fontawesome";

import PropTypes from "prop-types";
import CoinForm from "./CoinForm";
import { getCoinImage } from "../helpers/CoinHelper";

class PortfolioItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: props.editMode,
            coin: props.coin,
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

    renderButtons() {
        const { onDelete } = this.props;
        return (
            <ul className={styles.actions}>
                <li key="edit">
                    <button onClick={() => this.setState({ editMode: true })}>
                        <FontAwesome name="edit" />
                    </button>
                </li>
                <li key="delete">
                    <button className={styles.deleteButton} onClick={() => onDelete()}>
                        <FontAwesome name="remove" />
                    </button>
                </li>
            </ul>
        );
    }

    render() {
        const { validationErrors, details } = this.props;
        const { coin, editMode } = this.state;

        console.log(this.props);
        if (!details) {
            return <div />;
        }

        const image = coin.coinId ? (
            <img src={getCoinImage(coin.coinId)} alt="Coin" className={styles.image} />
        ) : null;

        const editForm = this.state.editMode ? (
            <CoinForm
                coin={coin}
                editMode={editMode}
                onSubmit={this.onEdit}
                onChange={this.onChange}
                onCancel={() => this.setState({ editMode: false })}
                validationErrors={validationErrors}
            />
        ) : null;

        const buttons = this.props.onDelete ? this.renderButtons() : undefined;

        return (
            <li className={styles.item} key={this.props.coin.id}>
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
                    {buttons}
                </div>
                {editForm}
            </li>
        );
    }
}

PortfolioItem.propTypes = {
    coin: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    editMode: PropTypes.bool.isRequired,
    key: PropTypes.string,
};

export default PortfolioItem;

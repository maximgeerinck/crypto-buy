import React, { Component } from "react";
import PropTypes from "prop-types";
import formStyles from "../forms.scss";
import Loader from "../components/Loader";
import ValidationHelper from "../helpers/ValidationHelper";
import cx from "classnames";
import moment from "moment";
import CoinSelectorContainer from "../coin/CoinSelectorContainer";
import CurrencyChooser from "../currency/CurrencyChooser";
import { round } from "../helpers/MathHelper";

class CoinForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: this.props.editMode,
            coin: this.props.coin,
        };

        this.timer = undefined;
    }

    componentDidMount() {
        const { editMode } = this.state;
        if (!editMode) {
            this.timer = setInterval(() => {
                let coin = this.state.coin;
                coin.boughtAt = moment();
                coin.currency = coin.currency || this.props.defaultCurrency;
                this.setState({ coin: coin });
            }, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.onSubmit(this.state.coin);
    };

    onCoinSelect = val => {
        let coin = this.state.coin;
        coin.coinId = val;
        this.props.onChange(coin);
    };

    onChangeCurrency = currency => {
        let coin = this.state.coin;
        coin.currency = currency;
        this.props.onChange(this.state.coin);
    };

    onChange = e => {
        e.preventDefault();
        clearInterval(this.timer);

        let coin = this.state.coin;

        if (e.target.name === "symbol") {
            coin.symbol = e.target.value.toUpperCase();
        } else if (e.target.name === "amount" || e.target.name === "boughtPrice") {
            coin[e.target.name] = parseFloat(e.target.value);
        } else {
            coin[e.target.name] = e.target.value;
        }
        this.props.onChange(this.state.coin);
    };

    render() {
        const { coinId, amount, boughtPrice, source, currency } = this.state.coin;
        const boughtAt = moment(this.state.coin.boughtAt).format("YYYY-MM-DDTHH:mm:ss");

        const { isSubmitting } = this.props;
        const { editMode } = this.state;

        const text = editMode ? "Save changes" : "Add coin";

        const buttonText = isSubmitting ? <Loader style={{ transform: "scale(0.9)" }} /> : text;

        const showPricePerCoin = this.props.initialInvestment > 0 ? { display: "none" } : null;
        const validation = this.props.validationErrors || {};

        const coinPurchaseDetails =
            amount && boughtPrice
                ? `Bought ${amount} ${coinId} for ${round(boughtPrice * amount, 7)} ${currency}`
                : undefined;

        const cancel = this.props.onCancel ? (
            <div className={formStyles.group}>
                <button
                    onClick={this.props.onCancel}
                    className={cx(formStyles.button, formStyles.danger)}
                >
                    Cancel
                </button>
            </div>
        ) : null;

        return (
            <form className={formStyles.form} onSubmit={this.onSubmit}>
                <div className={formStyles.group}>
                    <label htmlFor="symbol">Coin:</label>
                    <CoinSelectorContainer
                        name="coinId"
                        value={coinId}
                        onSelect={this.onCoinSelect}
                    />
                    <span className={formStyles.validationError}>
                        {ValidationHelper.parse(validation, "coinId", ["Coin"])}
                    </span>
                </div>
                <div className={formStyles.group}>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        step="any"
                        id="amount"
                        name="amount"
                        placeholder="0.00"
                        value={amount}
                        onChange={this.onChange}
                    />
                    <span className={formStyles.validationError}>
                        {ValidationHelper.parse(validation, "amount", ["Amount"])}
                    </span>
                </div>
                <div className={formStyles.row} style={showPricePerCoin}>
                    <div className={formStyles.group} style={{ flex: 1, flexBasis: "100px" }}>
                        <label htmlFor="currency">Price currency:</label>
                        <CurrencyChooser
                            currency={currency}
                            id="currency"
                            name="currency"
                            className={formStyles.input}
                            onSave={this.onChangeCurrency}
                        />
                    </div>
                    <div className={formStyles.group} style={{ flex: 8 }}>
                        <label htmlFor="price">Price for 1 coin:</label>
                        <input
                            type="number"
                            step="any"
                            id="price"
                            name="boughtPrice"
                            placeholder="0.00"
                            value={boughtPrice}
                            onChange={this.onChange}
                        />
                        <span className={formStyles.validationError}>
                            {ValidationHelper.parse(validation, "boughtPrice", ["Purchase price"])}
                        </span>
                    </div>
                </div>

                <div className={formStyles.group}>
                    <label htmlFor="source">Source:</label>
                    <input
                        type="text"
                        id="source"
                        name="source"
                        placeholder="gdax.com"
                        value={source}
                        onChange={this.onChange}
                    />
                    <span className={formStyles.validationError}>
                        {ValidationHelper.parse(validation, "source", ["Source"])}
                    </span>
                </div>
                <div className={formStyles.group}>
                    <label htmlFor="purchase_date">Purchase Date:</label>
                    <input
                        type="datetime-local"
                        id="purchase_date"
                        name="boughtAt"
                        placeholder="04-02-2017"
                        value={boughtAt}
                        onChange={this.onChange}
                    />
                    <span className={formStyles.validationError}>
                        {ValidationHelper.parse(validation, "boughtAt", ["Purchase date"])}
                    </span>
                </div>
                <div className={formStyles.group}>
                    <p className={formStyles.descriptor}>{coinPurchaseDetails}</p>
                </div>
                <div className={formStyles.group}>
                    <button type="submit" className={formStyles.button}>
                        {buttonText}
                    </button>
                </div>
                {cancel}
            </form>
        );
    }
}

CoinForm.propTypes = {
    coin: PropTypes.object.isRequired,
    editMode: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    defaultCurrency: PropTypes.string.isRequired,
};

CoinForm.defaultProps = {
    editMode: false,
    defaultCurrency: "USD",
};

export default CoinForm;

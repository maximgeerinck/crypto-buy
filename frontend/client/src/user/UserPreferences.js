import React, { Component } from "react";
import PropTypes from "prop-types";
import CurrencyChooser from "../currency/CurrencyChooser";
import formStyles from "../forms.scss";
import debounce from "debounce";
import ValidationHelper from "../helpers/ValidationHelper";
import InputWithLabel from "../components/InputWithLabel";

class UserCurrencyPreference extends Component {
    render() {
        return <CurrencyChooser {...this.props} />;
    }
}

UserCurrencyPreference.propTypes = {
    currency: PropTypes.string,
    onSave: PropTypes.func,
};

class UserPreferences extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialInvestment: props.initialInvestment,
            exchanges: {
                bittrex: props.bittrex || {},
            },
        };
    }

    componentWillMount() {
        this.delayedCallback = debounce(e => {
            this.props.onSave({ ...this.state });
        }, 500);
    }

    _onChangeCurrency = currency => {
        const state = { ...this.state, currency };
        this.props.onSave({ ...state });
        this.setState({ currency });
    };

    _onChangeInvestment = (value, e) => {
        e.persist();
        this.setState({ initialInvestment: parseInt(e.target.value, 10) || 0 });
        this.delayedCallback(e);
    };

    changeBittrexApiKey = (value, e) => {
        const exchanges = this.state.exchanges;
        exchanges.bittrex.apiKey = value.trim();
        if (exchanges.bittrex.apiKey === "") {
            delete exchanges.bittrex.apiKey;
        }
        if (exchanges.bittrex.apiKey === "" && exchanges.bittrex.apiSecret === "") {
            delete exchanges.bittrex;
        }
        this.setState({ exchanges });
        this.delayedCallback(e);
    };

    changeBittrexApiSecret = (value, e) => {
        const exchanges = this.state.exchanges;
        exchanges.bittrex.apiSecret = value.trim();
        if (exchanges.bittrex.apiSecret === "") {
            delete exchanges.bittrex.apiSecret;
        }
        if (exchanges.bittrex.apiKey === "" && exchanges.bittrex.apiSecret === "") {
            delete exchanges.bittrex;
        }
        this.setState({ exchanges });
        this.delayedCallback(e);
    };

    renderBittrexError() {
        const validation = this.props.validationErrors;
        return (
            <div className={formStyles.validationSummary}>
                {ValidationHelper.parse(validation, "exchanges.bittrex", [
                    "Your Bittrex key or secret",
                ])}
            </div>
        );
    }

    render() {
        const { currency } = this.props;
        const { initialInvestment, exchanges } = this.state;
        const validation = this.props.validationErrors || {};
        const bittrexError =
            validation && validation["exchanges.bittrex"] ? this.renderBittrexError() : undefined;

        return (
            <form className={formStyles.form}>
                <div className={formStyles.group}>
                    <label htmlFor="currency">Prefered currency</label>
                    <UserCurrencyPreference
                        currency={currency}
                        id="currency"
                        className={formStyles.input}
                        onSave={this._onChangeCurrency}
                    />
                    <span className={formStyles.descriptor}>
                        Which currency would you like your dashboard to be displayed in?
                    </span>
                </div>
                <div className={formStyles.group}>
                    <InputWithLabel
                        type="number"
                        name="initial_investment"
                        placeholder="0.00"
                        value={initialInvestment}
                        onChange={this._onChangeInvestment}
                        validation={validation["initialInvestment"]}
                    >
                        Here you can enter a total initial investment if you don't remember the
                        amount spend per coin (if this is > 0, then the price per coin will be
                        ignored)
                    </InputWithLabel>
                </div>

                <h3>Bittrex API</h3>
                <div className={formStyles.group}>
                    <InputWithLabel
                        name="bittrex_api_key"
                        value={exchanges.bittrex.apiKey}
                        onChange={this.changeBittrexApiKey}
                        validation={validation["exchanges.bittrex.apiKey"]}
                    >
                        This is your API key, it should have read-only permissions
                    </InputWithLabel>
                    <InputWithLabel
                        name="bittrex_api_secret"
                        value={exchanges.bittrex.apiSecret}
                        onChange={this.changeBittrexApiSecret}
                        validation={validation["exchanges.bittrex.apiSecret"]}
                        type="password"
                    >
                        This is your API Secret, it should have read-only permissions
                    </InputWithLabel>
                </div>
                {bittrexError}
            </form>
        );
    }
}

UserPreferences.propTypes = {
    currency: PropTypes.string,
    onSave: PropTypes.func,
};

export default UserPreferences;

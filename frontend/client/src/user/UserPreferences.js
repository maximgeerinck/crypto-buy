import React, { Component } from "react";
import PropTypes from "prop-types";
import CurrencyChooser from "../currency/CurrencyChooser";
import formStyles from "../forms.scss";
import debounce from "debounce";

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
                bittrex: props.bittrex,
            },
        };
    }

    componentWillMount() {
        this.delayedCallback = debounce(e => {
            this.props.onSave({ ...this.state });
        }, 500);
    }

    _onChangeInvestment = e => {
        e.persist();
        this.setState({ initialInvestment: parseInt(e.target.value, 10) || 0 });
        this.delayedCallback(e);
    };

    changeBittrexApiKey = e => {
        const exchanges = this.state.exchanges;
        exchanges.bittrex.apiKey = e.target.value.trim();
        this.setState({ exchanges });
        this.delayedCallback(e);
    };

    changeBittrexApiSecret = e => {
        const exchanges = this.state.exchanges;
        exchanges.bittrex.apiSecret = e.target.value.trim();
        this.setState({ exchanges });
        this.delayedCallback(e);
    };

    render() {
        const { currency } = this.props;
        const { initialInvestment, exchanges } = this.state;
        return (
            <form className={formStyles.form}>
                <div className={formStyles.group}>
                    <label htmlFor="currency">Prefered currency</label>
                    <UserCurrencyPreference
                        currency={currency}
                        id="currency"
                        className={formStyles.input}
                        onSave={preference => this.props.onSave({ currency: preference })}
                    />
                    <span className={formStyles.descriptor}>
                        Which currency would you like your dashboard to be displayed in?
                    </span>
                </div>
                <div className={formStyles.group}>
                    <label htmlFor="initialInvestment">Initial investment</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={initialInvestment}
                        id="initialInvestment"
                        onChange={this._onChangeInvestment}
                    />
                    <span className={formStyles.descriptor}>
                        Here you can enter a total initial investment if you don't remember the
                        amount spend per coin (if this is > 0, then the price per coin will be
                        ignored)
                    </span>
                </div>

                <h3>Bittrex API</h3>
                <div className={formStyles.group}>
                    <label htmlFor="bittrexApiKey">API Key</label>
                    <input
                        type="text"
                        value={exchanges.bittrex.apiKey}
                        id="bittrexApiKey"
                        onChange={this.changeBittrexApiKey}
                    />
                    <span className={formStyles.descriptor}>
                        This is your API key, it should have read-only permissions
                    </span>
                </div>

                <div className={formStyles.group}>
                    <label htmlFor="bittrexApiSecret">API Secret</label>
                    <input
                        type="password"
                        value={exchanges.bittrex.apiSecret}
                        id="bittrexApiSecret"
                        onChange={this.changeBittrexApiSecret}
                    />
                    <span className={formStyles.descriptor}>
                        This is your API Secret, it should have read-only permissions
                    </span>
                </div>
            </form>
        );
    }
}

UserPreferences.propTypes = {
    currency: PropTypes.string,
    onSave: PropTypes.func,
};

export default UserPreferences;

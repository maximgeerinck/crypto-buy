import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

class CoinSelector extends Component {
    _onSelect = val => {
        this.props.onSelect(val.value);
    };

    render() {
        const coins = this.props.coins;
        const selectedValue = this.props.value;

        const options = Object.keys(coins).map(key => {
            let coin = coins[key];
            return {
                value: key,
                label: `${coin.symbol} (${coin.name})`
            };
        });

        return (
            <Select
                name="coins"
                value={selectedValue}
                options={options}
                onChange={this._onSelect}
                className={this.props.className}
            />
        );
    }
}

CoinSelector.propTypes = {
    coins: PropTypes.object,
    onSelect: PropTypes.func,
    value: PropTypes.string,
    className: PropTypes.string
};

export default CoinSelector;

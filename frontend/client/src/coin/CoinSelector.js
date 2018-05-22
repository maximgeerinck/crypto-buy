import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import styles from "./coin.scss";
import cx from "classnames";
import debounce from "lodash.debounce";

class CoinOption extends Component {
    handleMouseDown = event => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    };
    handleMouseEnter = event => {
        this.props.onFocus(this.props.option, event);
    };
    handleMouseMove = event => {
        if (this.props.isFocused) return;
        this.props.onFocus(this.props.option, event);
    };
    render() {
        return (
            <div
                className={this.props.className}
                onMouseDown={this.handleMouseDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMouseMove}
                title={this.props.option.title}
            >
                <img
                    src={`https://cryptotrackr.com/assets/${
                        this.props.option.coinId
                    }.png`}
                    alt={this.props.option.coinId}
                    className={styles.icon}
                />
                {this.props.children}
            </div>
        );
    }
}

class CoinValue extends Component {
    render() {
        return (
            <div className="Select-value" title={this.props.value.title}>
                <span className={cx("Select-value-label", styles.label)}>
                    <img
                        src={`https://cryptotrackr.com/assets/${
                            this.props.value.coinId
                        }.png`}
                        alt={this.props.value.coinId}
                        className={styles.icon}
                    />
                    {this.props.children}
                </span>
            </div>
        );
    }
}

class CoinSelector extends Component {
    _onSelect = val => {
        this.props.onSelect(val.value);
    };

    coinToInput = coinId => {
        const coins = this.props.coins;
        if (!coins[coinId]) {
            return;
        }
        return {
            value: coinId,
            label: `${coins[coinId].symbol} (${coins[coinId].name})`,
            coinId: coinId,
        };
    };

    searchCoinByNameOrSymbol(term) {
        const coins = this.props.coins || [];
        const output = [];
        Object.keys(coins).forEach(key => {
            if (!coins[key] || !coins[key].symbol || !coins[key].name) {
                return;
            }

            const coin = coins[key];
            if (
                coin.name.toLowerCase().indexOf(term) >= 0 ||
                coin.symbol.toLowerCase().indexOf(term) >= 0
            ) {
                output.push(key);
            }
        });
        return output;
    }

    getCoins = debounce((searchTerm, callback) => {
        const coins = this.props.coins || [];

        const output = [];
        if (!searchTerm) {
            output.push(
                ...Object.keys(coins)
                    .slice(0, 5)
                    .map(this.coinToInput),
            );
        } else {
            output.push(
                ...this.searchCoinByNameOrSymbol(searchTerm.toLowerCase()).map(this.coinToInput),
            );
        }

        callback(null, { options: output });
    }, 250);

    render() {
        const selectedValue = this.coinToInput(this.props.value);
        return (
            <Select.Async
                name="coins"
                value={selectedValue}
                loadOptions={this.getCoins}
                onChange={this._onSelect}
                className={cx(styles.coinSelector, this.props.className)}
                optionComponent={CoinOption}
                valueComponent={CoinValue}
                coin={selectedValue}
            />
        );
    }
}

CoinSelector.propTypes = {
    coins: PropTypes.object,
    onSelect: PropTypes.func,
    value: PropTypes.string,
    className: PropTypes.string,
};

export default CoinSelector;

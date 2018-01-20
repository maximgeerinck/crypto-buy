import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import styles from "./coin.scss";
import cx from "classnames";

class CoinOption extends Component {
    // propTypes: {
    // 	children: PropTypes.node,
    // 	className: PropTypes.string,
    // 	isDisabled: PropTypes.bool,
    // 	isFocused: PropTypes.bool,
    // 	isSelected: PropTypes.bool,
    // 	onFocus: PropTypes.func,
    // 	onSelect: PropTypes.func,
    // 	option: PropTypes.object.isRequired,
    // },
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
                    src={`https://files.coinmarketcap.com/static/img/coins/32x32/${
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
    // propTypes: {
    // 	children: PropTypes.node,
    // 	placeholder: PropTypes.string,
    // 	value: PropTypes.object
    // },

    render() {
        return (
            <div className="Select-value" title={this.props.value.title}>
                <span className={cx("Select-value-label", styles.label)}>
                    <img
                        src={`https://files.coinmarketcap.com/static/img/coins/32x32/${
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

    getCoins = input => {
        const coins = this.props.coins;

        if (!input && coins["ethereum"]) {
            return Promise.resolve({ options: ["bitcoin", "ethereum"].map(this.coinToInput) });
        }

        const output = [];
        Object.keys(coins).forEach(key => {
            if (key.indexOf(input) >= 0 && coins[key]) {
                output.push(this.coinToInput(key));
            }
        });

        return Promise.resolve({ options: output });
    };

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

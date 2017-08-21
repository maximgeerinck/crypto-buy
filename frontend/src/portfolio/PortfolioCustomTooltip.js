import React, { Component } from "react";
import PropTypes from "prop-types";
import pieStyles from "./piechart.scss";
import { getCoinImage } from "../helpers/CoinHelper";

class CustomTooltip extends Component {
    render() {
        const { payload } = this.props;

        if (payload.length > 0) {
            return (
                <div className={pieStyles.tooltip}>
                    <div className={pieStyles.heading}>
                        <img src={getCoinImage(payload[0].payload.id)} alt="Coin" className={pieStyles.symbol} />
                        {payload[0].payload.symbol}
                    </div>
                    <div className={pieStyles.value}>{payload[0].payload.label}</div>
                </div>
            );
        }

        return null;
    }
}

CustomTooltip.propTypes = {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string
};

export default CustomTooltip;

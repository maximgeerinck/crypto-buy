import React, { Component } from "react";
import PropTypes from "prop-types";
import pieStyles from "./piechart.scss";
import { getCoinImage } from "../helpers/CoinHelper";

class CustomTooltip extends Component {
    renderLabel() {
        const { payload } = this.props;
        if (payload.length > 0) {
            return (
                <div className={pieStyles.value}>
                    <span dangerouslySetInnerHTML={{ __html: payload[0].payload.label }} />
                </div>
            );
        }
    }

    render() {
        const { payload, viewLabel } = this.props;

        const label = viewLabel ? this.renderLabel() : undefined;

        if (payload.length > 0) {
            return (
                <div className={pieStyles.tooltip}>
                    <div className={pieStyles.heading}>
                        <img
                            src={getCoinImage(payload[0].payload.id)}
                            alt="Coin"
                            className={pieStyles.symbol}
                        />
                        {payload[0].payload.symbol}
                    </div>
                    {label}
                </div>
            );
        }

        return null;
    }
}

CustomTooltip.propTypes = {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string,
    viewLabel: PropTypes.bool,
};

CustomTooltip.defaultProps = {
    viewLabel: true,
};

export default CustomTooltip;

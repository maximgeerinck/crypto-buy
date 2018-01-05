import React, { Component } from "react";
import PropTypes from "prop-types";
import shareStyles from "./share.scss";

class ShareOption extends Component {
    render() {
        const { text, onToggle, enabled } = this.props;

        return (
            <label className={shareStyles.shareOption}>
            <input type="checkbox" onClick={onToggle} checked={enabled} />
                <span className={shareStyles.slider}>
                    <span className={shareStyles.text}>{text}</span>
              </span>
          </label>
        );
    }
}

ShareOption.propTypes = {
    text: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    onToggle: PropTypes.func
};

export default ShareOption;

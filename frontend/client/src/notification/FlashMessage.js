import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./flash.scss";
import FontAwesome from "react-fontawesome";
import cx from "classnames";

class FlashMessage extends Component {
    getStyle(type) {
        switch (parseInt(type, 10)) {
            case 0:
                return styles.error;
            case 1:
                return styles.positive;
            case 2:
                return styles.info;
            case 3:
                return styles.warning;
            //no default
        }
    }

    render() {
        const { notification } = this.props;
        const style = this.getStyle(notification.type);

        return (
            <div className={cx(styles.flash, style)}>
                <p>{notification.message}</p>
                <button
                    className={styles.close}
                    onClick={() => this.props.onDismiss(notification.id)}
                >
                    <FontAwesome name="times" />
                </button>
            </div>
        );
    }
}

FlashMessage.propTypes = {
    notification: PropTypes.object.isRequired,
    onDismiss: PropTypes.func,
};

export default FlashMessage;

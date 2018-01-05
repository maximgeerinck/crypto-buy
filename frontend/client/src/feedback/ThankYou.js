import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./feedback.scss";
import FontAwesome from "react-fontawesome";

class ThankYou extends Component {
    render() {
        const message = this.props.message ? (
            <button onClick={this.props.onAttachMessage}>Want to attach a message?</button>
        ) : (
            undefined
        );
        return (
            <div className={styles.thanks}>
                <p>
                    <FontAwesome name="check" className={styles.thanksIcon} />Thank you!
              </p>
                {message}
          </div>
        );
    }
}

ThankYou.propTypes = {
    onAttachMessage: PropTypes.func,
    message: PropTypes.bool
};
ThankYou.defaultProps = {
    message: true
};

export default ThankYou;

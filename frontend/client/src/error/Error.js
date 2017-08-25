import React, { Component } from "react";
import PropTypes from "prop-types";
import { MdCancel } from "react-icons/lib/md";
import styles from "./error.scss";

class Error extends Component {
    render() {
        const { key, onClick } = this.props;
        return (
            <li key={key}>
                <button onClick={onClick} className={styles.icon}>
                    <MdCancel />
                </button>
                {this.props.children}
            </li>
        );
    }
}

Error.propTypes = {
    key: PropTypes.string.isRequired
};

export default Error;

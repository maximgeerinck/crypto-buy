import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import FontAwesome from "react-fontawesome";

import styles from "./navigation.scss";

class NavigationBar extends Component {
    render() {
        const { isAuthenticated } = this.props;

        const loginBlock = isAuthenticated ? (
            <li>
                <Link to="/account">
                    <FontAwesome name="user" />Account
                </Link>
            </li>
        ) : (
            <li>
                <Link to="/login">
                    <FontAwesome name="key" />Login
                </Link>
            </li>
        );

        const getStartedBlock = isAuthenticated ? (
            <li>
                <Link
                    onClick={(e) => {
                        e.preventDefault();
                        this.props.onLogout();
                    }}
                >
                    Logout
                </Link>
            </li>
        ) : (
            <li className={styles.getStarted}>
                <Link to="/register">
                    <FontAwesome name="plus" />Get started
                </Link>
            </li>
        );

        return (
            <nav className={styles.actionbar}>
                <ul>
                    <li>
                        <Link to="/">
                            <FontAwesome name="home" />Home
                        </Link>
                    </li>
                    <li>
                        <a href="mailto:hi@cryptotrackr.com">
                            <FontAwesome name="envelope" /> Mail us!
                        </a>
                    </li>
                    {loginBlock}
                    {getStartedBlock}
                </ul>
            </nav>
        );
    }
}

NavigationBar.PropTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default NavigationBar;

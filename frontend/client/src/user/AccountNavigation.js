import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

import styles from "./accountNavigation.scss";

class AccountNavigation extends Component {
    render() {
        const { active } = this.props;

        return (
            <div className={styles.navigation}>
                <ul>
                    <li className={active === "account" ? styles.active : undefined}>
                        <Link to="account">Account</Link>
                    </li>
                    <li className={active === "change_password" ? styles.active : undefined}>
                        <Link to="password">Change password</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

AccountNavigation.propTypes = {};

export default AccountNavigation;

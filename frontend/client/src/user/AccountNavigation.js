import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as AuthenticationActions from "../authentication/AuthenticationActions";
import { Link, browserHistory } from "react-router";

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
                  <li className={active === "settings" ? styles.active : undefined}>
                  <Link to="settings">Settings</Link>
                    </li>
                  <li className={active === "change_password" ? styles.active : undefined}>
                      <Link to="password">Change password</Link>
                    </li>
                  <li>
                      <Link
                          onClick={(e) => {
                                e.preventDefault();
                                this.props.authActions.logout();
                                browserHistory.replace("/")
                            }}
                        >
                    Logout
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

AccountNavigation.propTypes = {};

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
    return {
        authActions: bindActionCreators(AuthenticationActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountNavigation);
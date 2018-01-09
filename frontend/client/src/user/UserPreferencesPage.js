import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserActions from "./UserActions";
import Page from "../components/Page";
import Loader from "../components/Loader";
import styles from "./account.scss";
import AccountNavigation from "./AccountNavigation";
import UserPreferences from "./UserPreferences";

class ChangePasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password_mismatch: false,
        };
    }

    componentWillMount() {
        if (!this.props.user.loaded) this.props.userActions.me();
    }

    onSavePreferences = preferences => {
        this.props.userActions.updatePreferences(preferences);
    };

    render() {
        //TODO: Add loading page
        if (!this.props.user.loaded) {
            return (
                <Page title="Account">
                    <Loader />
                </Page>
            );
        }

        const user = this.props.user.get("user").toObject();

        console.log(this.props.user.get("preferences").toObject().validationErrors);
        const bittrex = user.preferences.exchanges ? user.preferences.exchanges.bittrex : {};

        return (
            <Page title="Settings">
                <div className={styles.welcome}>
                    Welcome back <span className={styles.strong}>{user.email}</span>
                </div>

                <AccountNavigation active="settings" />

                <h2>Preferences</h2>
                <UserPreferences
                    currency={user.preferences.currency}
                    initialInvestment={user.preferences.initialInvestment}
                    bittrex={bittrex}
                    onSave={this.onSavePreferences}
                    validationErrors={
                        this.props.user.get("preferences").toObject().validationErrors
                    }
                />
            </Page>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(UserActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage);

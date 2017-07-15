import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserActions from "./UserActions";
import Page from "../components/Page";
import Loader from "../components/Loader";
import Portfolio from "../portfolio/Portfolio";
import PortfolioAddItemForm from "../portfolio/PortfolioAddItemForm";
import UserPreferences from "./UserPreferences";

import styles from "./account.scss";

class AccountPage extends Component {
    componentWillMount() {
        if (!this.props.user.isLoaded) this.props.userActions.me();
    }

    onSavePreferences = (preferences) => {
        this.props.userActions.updatePreferences(preferences);
    };

    render() {
        //TODO: Add loading page
        if (!this.props.user.isLoaded)
            return (
                <Page title="Account">
                    <Loader />
                </Page>
            );

        const user = this.props.user.user;

        return (
            <Page title="Account">
                <div className={styles.welcome}>
                    Welcome back <span className={styles.strong}>{user.email}</span>
                </div>
                <h2>Preferences</h2>
                <UserPreferences
                    currency={user.preferences.currency}
                    initialInvestment={user.preferences.initialInvestment}
                    onSave={this.onSavePreferences}
                />
                <h2>Add Currency</h2>
                <PortfolioAddItemForm initialInvestment={user.preferences.initialInvestment} />
                <h2>Portfolio</h2>
                <Portfolio />
            </Page>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        userActions: bindActionCreators(UserActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);

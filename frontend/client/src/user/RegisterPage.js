import React, { Component } from "react";
import Page from "../components/Page";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as UserActions from "./UserActions";

import pageStyle from "../components/page.scss";
import ValidationHelper from "../helpers/ValidationHelper";
import { Link } from "react-router";
import formStyles from "../forms.scss";
import { browserHistory } from "react-router";

import Loader from "../components/Loader";

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: undefined,
            password: undefined
        };
    }

    onCreate = (e) => {
        e.preventDefault();
        this.props.onCreate({
            password: this.state.password,
            email: this.state.email
        });
        return false;
    };

    onPasswordChange = (e) => this.setState({ password: e.target.value });
    onEmailChange = (e) => this.setState({ email: e.target.value });

    render() {
        const { email, password } = this.state;

        const validation = this.props.validationErrors;

        return (
            <form className={formStyles.formFullPage} onSubmit={this.onCreate}>
                <div className={formStyles.group}>
                    <label htmlFor="Email">Email</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="name@provider.com"
                        onChange={this.onEmailChange}
                        className={validation.email ? formStyles.invalid : null}
                    />
                    <span className={formStyles.validationError}>
                        {ValidationHelper.parse(validation, "email", [ "email" ])}
                    </span>
                </div>
                <div className={formStyles.group}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={this.onPasswordChange}
                        className={validation.password ? formStyles.invalid : null}
                    />
                    <span className={formStyles.validationError}>
                        {ValidationHelper.parse(validation, "password", [ "password", 6 ])}
                    </span>
                </div>
                <div className={formStyles.group}>
                    <button type="submit" className={formStyles.button}>
                        Create your account
                    </button>
                </div>
                <div className={formStyles.noAccount}>
                    <Link to="/login">Already have an account? Login here</Link>
                </div>
            </form>
        );
    }
}

RegisterForm.PropTypes = {
    onCreate: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired
};

RegisterForm.defaultProps = {
    validationErrors: {}
};

class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrationSucceeded: false
        };
    }

    _createAccount = (values) => {
        this.props.userActions.create(values);
    };

    render() {
        // const validationErrors = this.props.user.form.get('validationErrors');
        const validationErrors = this.props.user.form.get("validationErrors");

        let submitting = null,
            successfulMessage = null,
            form = null;

        if (this.props.user.form.get("isSubmitting")) {
            submitting = (
                <div className={pageStyle.container}>
                    <Loader />
                    <div>Registering...</div>
                </div>
            );
        }

        if (this.props.user.form.get("succeeded")) {
            successfulMessage = (
                <div className={pageStyle.container}>
                    <p>Registration successful! You may login now.</p>
                </div>
            );
            setTimeout(() => {
                browserHistory.push("/login");
            }, 3000);
        }

        if (!this.props.user.form.get("isSubmitting") && !this.props.user.form.get("succeeded")) {
            form = <RegisterForm onCreate={this._createAccount} validationErrors={validationErrors || {}} />;
        }

        return (
            <Page title="Register" custom className={pageStyle.focused}>
                {submitting}
                {successfulMessage}
                {form}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);

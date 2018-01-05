import React, { Component } from "react";
import PropTypes from "prop-types";
import Page from "../components/Page";
import * as AuthActions from "./AuthenticationActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router";

import ValidationHelper, { ValidationType } from "../helpers/ValidationHelper";
import Loader from "../components/Loader";

import formStyles from "../forms.scss";
import pageStyle from "../components/page.scss";

export class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: null,
            rememberMe: false
        };
    }

  _onLogin = e => {
      e.preventDefault();
      this.props.onSubmit(this.state.email, this.state.password);
      return 0;
  };

  render() {
      let errorContainer = this.props.isInvalid ?
          <div className={formStyles.validationSummary}>
          {ValidationHelper.constructMessage(ValidationType.V_LOGIN_COMBO_INCORRECT)}
        </div> :
          null;

      if (this.props.error) {
          errorContainer = (
            <div className={formStyles.validationSummary}>
                {ValidationHelper.constructMessage(ValidationType.TIMEOUT)}
              </div>
          );
      }

      return (
        <form className={formStyles.formFullPage} onSubmit={this._onLogin}>
              <div className={formStyles.group}>
                  <label htmlFor="Email">Email</label>
            <input
                      type="email"
                      placeholder="name@provider.com"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                  />
          </div>

            <div className={formStyles.group}>
                  <label htmlFor="password">Password</label>
                <input type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })} />
              </div>
            <div className={formStyles.forgotPassword}>
                <Link to="/forgot">Forgot password?</Link>
              </div>

              {errorContainer}

            <div className={formStyles.group}>
                <button type="submit" className={formStyles.button}>
            Login
                  </button>
              </div>
            <div className={formStyles.noAccount}>
                <Link to="/register">Don't have an account yet?</Link>
              </div>
          </form>
      );
  }
}

LoginForm.PropTypes = {
    onSubmit: PropTypes.func.isRequired
};

class LoginPage extends Component {
  _onLogin = (email, password) => {
      this.props.authActions.authenticate(email, password);
  };

  render() {
      const isInvalid = this.props.auth.form.get("isInvalid");
      const error = this.props.auth.error;

      let submitting, form;
      if (this.props.auth.form.get("isSubmitting")) {
          submitting = (
            <div className={pageStyle.container}>
                <Loader />
                <div>Logging in...</div>
              </div>
          );
      } else {
          form = <LoginForm onSubmit={this._onLogin} isInvalid={isInvalid} error={error} />;
      }

      return (
        <Page title="Login" custom className={pageStyle.focused}>
            {submitting}
            {form}
          </Page>
      );
  }
}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => {
    return {
        authActions: bindActionCreators(AuthActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

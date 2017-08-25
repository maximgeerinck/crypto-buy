import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Page from '../components/Page';
import PortfolioTracker from '../portfolio/PortfolioTracker';
import * as AuthenticationActions from '../authentication/AuthenticationActions';
import cx from 'classnames';

import homeStyles from './home.scss';
import pageStyles from '../components/page.scss';

import exampleImage from './screenshot.jpg';

const DEMO_EMAIL = "demo@cryptotrackr.com";
const DEMO_PASSWORD = "demo123";

export class HomeComponent extends Component {

  render() {
    return (
      <Page custom className={cx(pageStyles.focused, homeStyles.main)}>
        <h1>Easily track your crypto currency portfolio</h1>
        <p className={homeStyles.adText}>
          Don't spend time looking to different websites to track your portfolio changes, get an overview with this
simple dashboard.
        </p>


        <ul className={homeStyles.buttonBar}>
          <a className={homeStyles.button} href="/register">
            Sign Up
          </a>

          <button className={cx(homeStyles.button, homeStyles.demoButton)} onClick={this.props.onBrowseDemo}>
            Browse Demo
</button>
        </ul>

        <img src={exampleImage} className={homeStyles.adv} alt="preview"/>
      </Page>
    );
  }
}

HomeComponent.propTypes = {
  onBrowseDemo: PropTypes.func.isRequired
}

class HomePage extends Component {

  _onBrowseDemo = () => {
    this.props.auth.authenticate(DEMO_EMAIL, DEMO_PASSWORD);
  }

  render() {

    if (!this.props.isAuthenticated) return <HomeComponent onBrowseDemo={this._onBrowseDemo} />;

    return <PortfolioTracker />;
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => {
  return {
    auth: bindActionCreators(AuthenticationActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
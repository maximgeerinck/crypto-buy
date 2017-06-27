import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';

import * as AuthActions from '../authentication/AuthenticationActions';

import styles from './navigation.scss';

class NavigationBar extends Component {
  render() {
    const { dispatch, isAuthenticated } = this.props;

    const loginBlock = isAuthenticated
      ? <li><Link to="/account">Account</Link></li>
      : <li><Link to="/login">Login</Link></li>;

    const getStartedBlock = isAuthenticated
      ? <li>
          <Link
            onClick={() => {
              dispatch(AuthActions.logout());
              browserHistory.replace('/');
            }}
          >
            Logout
          </Link>
        </li>
      : <li><Link to="/register" className={styles.getStarted}>Get started</Link></li>;

    return (
      <nav className={styles.actionbar}>
        <ul>
          <li><Link to="/">Home</Link></li>
          {loginBlock}
          {getStartedBlock}
        </ul>
      </nav>
    );
  }
}

NavigationBar.PropTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default NavigationBar;

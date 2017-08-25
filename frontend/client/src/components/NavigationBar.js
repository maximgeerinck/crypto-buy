import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { FaEnvelope, FaUser, FaPlus, FaHome } from "react-icons/lib/fa";

import { TiKey } from "react-icons/lib/ti";
import * as AuthActions from '../authentication/AuthenticationActions';

import styles from './navigation.scss';

class NavigationBar extends Component {
  render() {
    const { dispatch, isAuthenticated } = this.props;

    const loginBlock = isAuthenticated
      ? <li><Link to="/account"><FaUser/>Account</Link></li>
      : <li><Link to="/login"><TiKey/>Login</Link></li>;

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
      : <li><Link to="/register" className={styles.getStarted}><FaPlus/>Get started</Link></li>;

    return (
      <nav className={styles.actionbar}>
        <ul>
          <li><Link to="/"><FaHome/>Home</Link></li>
          <li><a href="mailto:hi@cryptotrackr.com"><FaEnvelope/>Mail us!</a></li>
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

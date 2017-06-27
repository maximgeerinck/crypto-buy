import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from './UserActions';
import Page from '../components/Page';
import { Link } from 'react-router';

import style from './account.scss';

class AccountPage extends Component {
  componentWillMount() {
    if (!this.props.user.isLoaded) this.props.userActions.me();
  }

  render() {
    //TODO: Add loading page
    if (!this.props.user.isLoaded) return <Page title="Account">Loading...</Page>;

    const user = this.props.user.user;

    return (
      <Page title="Account">
        {' '}
        Welcome <span>{user.email}</span>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(UserActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);

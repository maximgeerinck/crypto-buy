import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as UserActions from '../user/UserActions';

import page from './page.scss';

class Page extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated && !this.props.user) {
      this.props.userActions.me();
    }
  }

  render() {
    const { dispatch } = this.props;
    const isAuthenticated = this.props.auth.isAuthenticated;

    const className = this.props.className || null;
    const { navigationBar, children, title, custom } = this.props;
    const navbar = navigationBar ? <NavigationBar dispatch={dispatch} isAuthenticated={isAuthenticated} /> : null;
    const titleContainer = title ? <h1>{title}</h1> : null;

    const childrenWrapper = !custom ? <div className={page.content}>{children}</div> : children;

    return (
      <div>
        {navbar}
        <div className={cx(page.page, className)}>
          {titleContainer}
          {childrenWrapper}
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  navigationBar: PropTypes.bool.isRequired,
  title: PropTypes.string,
  custom: PropTypes.bool.isRequired,
  className: PropTypes.string
};
Page.defaultProps = {
  navigationBar: true,
  custom: false
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    userActions: bindActionCreators(UserActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);

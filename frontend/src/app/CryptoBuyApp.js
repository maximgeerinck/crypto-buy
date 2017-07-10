import React, { Component } from 'react';
import { Router } from 'react-router'
import routes from '../routes';
import ReactGA from 'react-ga';
import './index.scss';

const TRACKING_ID = 'UA-101986081-1';

ReactGA.initialize(TRACKING_ID);

class ImageRotatorApp extends Component {

  logPageView() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }

  render() {

    const { history } = this.props;

    return (
      <Router history={history} routes={routes} onUpdate={this.logPageView} />
    );
  }
}

export default ImageRotatorApp;
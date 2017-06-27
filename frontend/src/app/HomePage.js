import React, { Component } from 'react';

import homeStyles from './home.scss';
import Page from '../components/Page';

export class HomeComponent extends Component {
  render() {
    return (
      <Page custom className={homeStyles.main}>
        nothing
      </Page>
    );
  }
}

class HomePage extends Component {
  render() {
    if (this.props.children) return this.props.children;

    return <HomeComponent />;
  }
}

export default HomePage;

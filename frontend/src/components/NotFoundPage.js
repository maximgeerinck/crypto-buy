import React from 'react';
import Page from './Page';

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <Page title="404 - Not Found">
        Could not find the request page.
      </Page>
    );
  }
}
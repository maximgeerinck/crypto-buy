import React, { Component } from 'react';

import style from './loader.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';

class Loader extends Component {
  render() {
    const customStyle = { backgroundColor: this.props.color };

    return (
      <div className={this.props.className}>
        <div className={style.spinner}>
          <div className={style.bounce1} style={customStyle} />
          <div className={style.bounce2} style={customStyle} />
          <div className={style.bounce3} style={customStyle} />
        </div>
      </div>
    );
  }
}

Loader.PropTypes = {
  color: PropTypes.string.isRequired,
  className: PropTypes.object
};
Loader.defaultProps = {
  color: 'white'
};

export default Loader;

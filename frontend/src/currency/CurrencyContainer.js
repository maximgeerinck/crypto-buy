import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CurrencyContainer extends Component {
  render() {
    return (
      <div>
        <div>
          ICONOMI (ICN)
          <ul>
            <li>-2.52%</li>
            <li>-10.83%*</li>
            <li>+4.41%</li>
          </ul>
        </div>
        <div>
          +20.56%
        </div>
      </div>
    );
  }
}

CurrencyContainer.PropTypes = {
  name: PropTypes.string.isRequired,
  percentageDay: PropTypes.number,
  percentageWeek: PropTypes.number,
  percentageMonth: PropTypes.number,
  roi: PropTypes.number
};

export default CurrencyContainer;

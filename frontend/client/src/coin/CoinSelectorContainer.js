import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as CoinActions from "./CoinActions";
import CoinSelector from "./CoinSelector";

class CoinSelectorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined
    };
  }

  componentWillMount() {
    this.props.coinActions.retrieve();
  }

  _onSelect = val => {
    this.setState({ value: val });
  };

  render() {
    const value = this.props.value || this.state.value;
    return (
      <CoinSelector
                coins={this.props.coins.coins.toObject()}
                onSelect={this.props.onSelect || this._onSelect}
                value={value}
                className={this.props.className}
            />
    );
  }
}

const mapStateToProps = state => ({
  coins: state.coins
});

const mapDispatchToProps = dispatch => {
  return {
    coinActions: bindActionCreators(CoinActions, dispatch)
  };
};

CoinSelectorContainer.propTypes = {
  onSelect: PropTypes.func,
  value: PropTypes.string,
  className: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinSelectorContainer);
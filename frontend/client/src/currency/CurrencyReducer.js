import * as types from './CurrencyActionTypes';
import { Record } from 'immutable';

var InitialState = new Record({
  items: {},
  loading: true
});

let initialState = new InitialState();
const CurrencyReducer = (state = initialState, action) => {
  switch (action.type) {
  case types.CURRENCY_SUCCESS:
    return state.set('items', action.body.currencies).set('loading', false);
  default:
    return state;
  }
};

export default CurrencyReducer;
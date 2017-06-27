import * as types from './PortfolioActionTypes';
import { Record, Map } from 'immutable';

const PORTFOLIO = 'portfolio';

var InitialState = new Record({
  items: null,
  details: null,
  page: Map({
    isLoading: true,
    isFetching: false
  })
});

let initialState = new InitialState();
if (localStorage.getItem(PORTFOLIO))
  initialState = initialState.set('items', JSON.parse(localStorage.getItem(PORTFOLIO)));

const PortfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RETRIEVE_ITEMS_SUCCESS:
      localStorage.setItem(PORTFOLIO, JSON.stringify(action.body));
      return state.set('items', action.body);
    case types.CURRENCY_DETAILS_REQUEST:
      return state.setIn(['page', 'isFetching'], true);
    case types.CURRENCY_DETAILS_SUCCESS:
      return state.set('details', action.body[0]).setIn(['page', 'isFetching'], false);
    case types.CURRENCY_DETAILS_FAILURE:
      return state.setIn(['page', 'isFetching'], false);
    default:
      return state;
  }
};

export default PortfolioReducer;

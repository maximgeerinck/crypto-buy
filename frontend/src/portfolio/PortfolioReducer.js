import * as types from './PortfolioActionTypes';
import { Record, Map } from 'immutable';

const PORTFOLIO = 'portfolio';

var InitialState = new Record({
  page: Map({
    isLoading: true,
    isFetching: false
  }),
  form: Map({
    isSubmitting: false,
    error: undefined
  }),

  // the coins the user owns
  coins: Map({
    loading: true,
    items: []
  }),

  // the coin details (aka stats)
  stats: Map({
    coins: {},
    loading: true
  })
});

let initialState = new InitialState();
// if (localStorage.getItem(PORTFOLIO))
//   initialState = initialState.set('items', JSON.parse(localStorage.getItem(PORTFOLIO)));

const PortfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RETRIEVE_ITEMS_SUCCESS:
      // localStorage.setItem(PORTFOLIO, JSON.stringify(action.body));
      return state.setIn(['coins', 'items'], action.body).setIn(['coins', 'loading'], false);

    case types.COIN_DETAILS_REQUEST:
      return state.setIn(['page', 'isFetching'], true);
    case types.COIN_DETAILS_SUCCESS:
      return state.setIn(['stats', 'coins'], action.body).setIn(['stats', 'loading'], false);
    case types.COIN_DETAILS_FAILURE:
      return state.setIn(['page', 'isFetching'], false);
    case types.COINS_ADD_REQUEST:
      return state.setIn(['form', 'isSubmitting'], true);
    case types.COINS_ADD_SUCCESS:
    case types.COIN_UPDATE_SUCCESS:
      // localStorage.setItem(PORTFOLIO, JSON.stringify(action.body));
      return state.setIn(['coins', 'items'], action.body).setIn(['form', 'isSubmitting'], false);
    case types.COIN_DELETE_SUCCESS:
      localStorage.setItem(PORTFOLIO, JSON.stringify(action.body));
      return state.setIn(['coins', 'items'], action.body).setIn(['form', 'isSubmitting'], false);
    default:
      return state;
  }
};

export default PortfolioReducer;

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import auth from '../authentication/AuthenticationReducer';
import user from '../user/UserReducer';
import portfolio from '../portfolio/PortfolioReducer';
import currency from '../currency/CurrencyReducer';

const rootReducer = combineReducers({
  form,
  auth,
  user,
  portfolio,
  currency,
  routing: routerReducer
});

export default rootReducer;

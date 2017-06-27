import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import auth from '../authentication/AuthenticationReducer';
import user from '../user/UserReducer';
import portfolio from '../portfolio/PortfolioReducer';

const rootReducer = combineReducers({
  form,
  auth,
  user,
  portfolio,
  routing: routerReducer
});

export default rootReducer;

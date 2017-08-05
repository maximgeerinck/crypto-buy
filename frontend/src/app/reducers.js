import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import { routerReducer } from "react-router-redux";

import auth from "../authentication/AuthenticationReducer";
import user from "../user/UserReducer";
import portfolio from "../portfolio/PortfolioReducer";
import currency from "../currency/CurrencyReducer";
import share from "../share/ShareReducer";
import coins from "../coin/CoinReducer";

const rootReducer = combineReducers({
    form,
    auth,
    user,
    portfolio,
    currency,
    share,
    coins,
    routing: routerReducer
});

export default rootReducer;

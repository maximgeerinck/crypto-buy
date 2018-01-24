import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import { routerReducer } from "react-router-redux";

import * as types from "../authentication/AuthenticationActionTypes";

import auth from "../authentication/AuthenticationReducer";
import user from "../user/UserReducer";
import portfolio from "../portfolio/PortfolioReducer";
import currency from "../currency/CurrencyReducer";
import share from "../share/ShareReducer";
import coins from "../coin/CoinReducer";
import app from "../error/ErrorReducer";
import notification from "../notification/NotificationReducer";
import feedback from "../feedback/FeedbackReducer";

const appReducer = combineReducers({
    form,
    auth,
    user,
    portfolio,
    currency,
    share,
    coins,
    app,
    notification,
    feedback,
    routing: routerReducer,
});

const rootReducer = (state, action) => {
    if (action.type === types.LOGOUT) {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;

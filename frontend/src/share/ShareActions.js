import * as types from "./ShareActionTypes";
import api from "../app/api";

export const loadPortfolioSuccess = (portfolio) => ({ type: types.SHARE_PORTFOLIO_LOAD_SUCCESS, body: portfolio });
export const loadPortfolioRequest = () => ({ type: types.SHARE_PORTFOLIO_LOAD_REQUEST });
export const loadPortfolioFailure = (errors) => ({ type: types.SHARE_PORTFOLIO_LOAD_FAILURE, body: errors });

export const loadPortfolio = (token) => {
    return (dispatch, getState) => {
        api.get(`portfolio/${token}`).then((portfolio) => {
            dispatch(loadPortfolioSuccess(portfolio));
        });
    };
};

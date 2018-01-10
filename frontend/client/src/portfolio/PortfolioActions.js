import * as types from "./PortfolioActionTypes";
import api, { buildGetRequest } from "../app/api";
import { reduceItems } from "./PortfolioHelper";
import moment from "moment";
import * as ErrorHelper from "../helpers/ErrorHelper";
import * as ErrorActions from "../error/ErrorActions";

const retrieveItemsSuccess = items => ({ type: types.RETRIEVE_ITEMS_SUCCESS, body: items });
const retrieveItemsRequest = () => ({ type: types.RETRIEVE_ITEMS_REQUEST });
const retrieveItemsFailure = () => ({ type: types.RETRIEVE_ITEMS_FAILURE });

const coinDetailsSuccess = details => ({ type: types.COIN_DETAILS_SUCCESS, body: details });
const coinDetailsRequest = () => ({ type: types.COIN_DETAILS_REQUEST });
const coinDetailsFailure = () => ({ type: types.COIN_DETAILS_FAILURE });

const coinsAddSuccess = items => ({ type: types.COINS_ADD_SUCCESS, body: items });
const coinsAddRequest = () => ({ type: types.COINS_ADD_REQUEST });
const coinsAddFailure = errors => ({ type: types.COINS_ADD_FAILURE, body: errors });

const coinUpdateSuccess = items => ({ type: types.COIN_UPDATE_SUCCESS, body: items });
const coinUpdateRequest = () => ({ type: types.COIN_UPDATE_REQUEST });
const coinUpdateFailure = (key, errors) => ({
    type: types.COIN_UPDATE_FAILURE,
    body: errors,
    key: key,
});

const coinDeleteSuccess = items => ({ type: types.COIN_DELETE_SUCCESS, body: items });
const coinDeleteRequest = () => ({ type: types.COIN_DELETE_REQUEST });
const coinDeleteFailure = errors => ({ type: types.COIN_DELETE_FAILURE, body: errors });

export const retrieve = callback => {
    return (dispatch, getState) => {
        dispatch(retrieveItemsRequest());

        return buildGetRequest("portfolio/load")
            .auth(getState().auth.token)
            .onTimeout(() => {
                dispatch(ErrorActions.timeout("Could not fetch portfolio"));
            }, 60 * 1000)
            .send()
            .then(items => {
                if (callback) {
                    callback(items);
                }
                dispatch(retrieveItemsSuccess(items));
            })
            .catch(err => {
                dispatch(retrieveItemsFailure(err.data));
            });
    };
};

export const details = items => {
    return (dispatch, getState) => {
        dispatch(coinDetailsRequest());

        const coins = items
            ? reduceItems(items)
            : reduceItems(getState().portfolio.coins.get("items"));

        return api
            .post("coin/details", { coins: Object.keys(coins) }, getState().auth.token)
            .then(coins => {
                dispatch(coinDetailsSuccess(coins));
            })
            .catch(err => {
                dispatch(coinDetailsFailure(err.data));
            });
    };
};

export const addCoins = coins => {
    return (dispatch, getState) => {
        dispatch(coinsAddRequest());

        let c = [].concat(coins);
        c.forEach(coin => {
            coin.boughtAt = moment(coin.boughtAt).toISOString(); // send timezone as UTC to backend
        });

        return api
            .post("portfolio/coins/add", c, getState().auth.token)
            .then(portfolio => {
                dispatch(coinsAddSuccess(portfolio));
                return Promise.resolve(true);
            })
            .catch(err => {
                if (err && err.error === "E_VALIDATION") {
                    dispatch(coinsAddFailure(err.validation));
                } else {
                    dispatch(ErrorHelper.handle(err));
                }
            });
    };
};

export const updateCoin = (key, coin) => {
    return (dispatch, getState) => {
        dispatch(coinUpdateRequest());

        if (coin.boughtAt) {
            coin.boughtAt = moment(coin.boughtAt).toISOString();
        }

        return api
            .post("portfolio/coin/update", coin, getState().auth.token)
            .then(portfolio => {
                dispatch(coinUpdateSuccess(portfolio));
                return Promise.resolve(true);
            })
            .catch(err => {
                if (err && err.error === "E_VALIDATION") {
                    dispatch(coinUpdateFailure(key, err.validation));
                } else {
                    dispatch(ErrorHelper.handle(err));
                }
            });
    };
};

export const removeCoin = id => {
    return (dispatch, getState) => {
        dispatch(coinDeleteRequest());

        return api
            .post("portfolio/coin/remove", { id: id }, getState().auth.token)
            .then(portfolio => {
                dispatch(coinDeleteSuccess(portfolio));
            })
            .catch(err => {
                dispatch(coinDeleteFailure(err.data));
            });
    };
};

import * as types from "./CoinActionTypes";
import api from "../app/api";
import moment from "moment";
import * as ErrorHelper from "../helpers/ErrorHelper";

const retrieveCoinsSuccess = coins => ({ type: types.COINS_SUCCESS, body: coins });

export const retrieve = () => {
    return (dispatch, getState) => {
        api.get("coins/1", getState().auth.token).then(coins => dispatch(retrieveCoinsSuccess(coins[0])));
    };
};

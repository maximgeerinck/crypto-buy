import * as types from "./CoinActionTypes";
import { buildGetRequest } from "../app/api";
import * as ErrorActions from "../error/ErrorActions";

const retrieveCoinsSuccess = coins => ({ type: types.COINS_SUCCESS, body: coins });

export const retrieve = () => {
    return (dispatch, getState) => {
        return buildGetRequest("coins/1")
            .auth(getState().auth.token)
            .onTimeout(() => {
                dispatch(ErrorActions.timeout("Could not fetch coins"));
            }, 60 * 1000)
            .send()
            .then(coins => {
                dispatch(retrieveCoinsSuccess(coins[0]));
            });
    };
};

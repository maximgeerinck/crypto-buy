import * as types from "./CoinActionTypes";
import { GetRequest } from "../app/api";
import * as ErrorActions from "../error/ErrorActions";

const retrieveCoinsSuccess = (coins) => ({ type: types.COINS_SUCCESS, body: coins });

export const retrieve = () => {
    return (dispatch, getState) => {
        return new GetRequest("coins/1", getState().auth.token)
            .onTimeout(() => {
                dispatch(ErrorActions.timeout("Could not fetch coins"));
            }, 60 * 1000)
            .send()
            .then((coins) => {
                dispatch(retrieveCoinsSuccess(coins[0]));
            });
    };
};

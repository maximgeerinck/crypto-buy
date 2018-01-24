import * as types from "./CurrencyActionTypes";
import { buildGetRequest } from "../app/api";
import * as ErrorActions from "../error/ErrorActions";
import * as CacheHelper from "../helpers/CacheHelper";
import { KEY_CURRENCY } from "./CurrencyReducer";

const currencySuccess = currencies => ({ type: types.CURRENCY_SUCCESS, body: currencies });
const currencyRequest = () => ({ type: types.CURRENCY_REQUEST });
const currencyFailed = () => ({ type: types.CURRENCY_FAILURE });

export const index = currencies => {
    return dispatch => {
        if (CacheHelper.getCache(KEY_CURRENCY)) {
            return;
        }

        dispatch(currencyRequest());

        return buildGetRequest("currencies/latest")
            .onTimeout(() => {
                dispatch(ErrorActions.timeout("Could not fetch currencies"));
            }, 60 * 1000)
            .send()
            .then(currencies => {
                dispatch(currencySuccess(currencies));
            })
            .catch(err => {
                currencyFailed();
            });
    };
};

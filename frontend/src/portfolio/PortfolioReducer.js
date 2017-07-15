import * as types from "./PortfolioActionTypes";
import { Record, Map, List } from "immutable";

const PORTFOLIO = "portfolio";

var InitialState = new Record({
    page: Map({
        isLoading: true,
        isFetching: false
    }),
    form: Map({
        isSubmitting: false,
        error: undefined
    }),

    // the coins the user owns
    coins: Map({
        loading: true,
        items: [],
        validationErrors: List([])
    }),
    // the coin details (aka stats)
    stats: Map({
        coins: {},
        loading: true
    })
});

let initialState = new InitialState();
// if (localStorage.getItem(PORTFOLIO))
//   initialState = initialState.set('items', JSON.parse(localStorage.getItem(PORTFOLIO)));

const PortfolioReducer = (state = initialState, action) => {
    // reset actions
    state = state.setIn([ "coins", "validationErrors" ], List([]));

    switch (action.type) {
        case types.RETRIEVE_ITEMS_SUCCESS:
            return state
                .setIn([ "coins", "items" ], action.body)
                .setIn([ "coins", "validationErrors" ], action.body.map((coin) => null))
                .setIn([ "coins", "loading" ], false);

        case types.COIN_DETAILS_REQUEST:
            return state.setIn([ "page", "isFetching" ], true);

        case types.COIN_DETAILS_SUCCESS:
            return state.setIn([ "stats", "coins" ], action.body).setIn([ "stats", "loading" ], false);

        case types.COIN_DETAILS_FAILURE:
            return state.setIn([ "page", "isFetching" ], false);

        case types.COINS_ADD_REQUEST:
            return state.setIn([ "form", "isSubmitting" ], true);

        case types.COINS_ADD_SUCCESS:
        case types.COIN_UPDATE_SUCCESS:
            return state.setIn([ "coins", "items" ], action.body).setIn([ "form", "isSubmitting" ], false);

        case types.COIN_DELETE_SUCCESS:
            localStorage.setItem(PORTFOLIO, JSON.stringify(action.body));
            return state.setIn([ "coins", "items" ], action.body).setIn([ "form", "isSubmitting" ], false);

        case types.COINS_ADD_FAILURE:
            // filter out the index if exists
            let errors = {};
            for (let key in action.body) {
                errors[key.replace("0.", "")] = action.body[key];
            }

            return state.setIn([ "form", "errors" ], errors).setIn([ "form", "isSubmitting" ], false);

        case types.COIN_UPDATE_FAILURE:
            var changedErrors = [].concat(state.coins.get("validationErrors"));
            changedErrors[action.key] = action.body;
            return state.setIn([ "coins", "validationErrors" ], changedErrors);

        default:
            return state;
    }
};

export default PortfolioReducer;

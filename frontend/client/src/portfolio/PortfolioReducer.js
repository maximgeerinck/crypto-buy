import * as types from "./PortfolioActionTypes";
import { LOGOUT } from "../authentication/AuthenticationActionTypes";
import { List, Map, Record } from "immutable";
import * as CacheHelper from "../helpers/CacheHelper";

const COINS = "portfolio_coins";
const DETAILS = "portfolio_details"; // the coin statistics

var InitialState = new Record({
    page: Map({
        loaded: false,
        isFetching: false,
    }),
    form: Map({
        isSubmitting: false,
        error: undefined,
    }),

    // the coins the user owns
    coins: Map({
        loaded: false,
        items: [],
        view: {}, // the coins in a view
        validationErrors: List([]),
    }),
    // the coin details (aka details)
    details: Map({
        coins: [],
        loaded: false,
    }),

    // coin stats by identifier
    stats: {},
});

let initialState = new InitialState();

if (CacheHelper.getCache(COINS)) {
    initialState = initialState
        .setIn(["coins", "items"], CacheHelper.getCache(COINS))
        .setIn(["coins", "loaded"], true);
}

if (CacheHelper.getCache(DETAILS)) {
    initialState = initialState
        .setIn(["details", "coins"], CacheHelper.getCache(DETAILS))
        .setIn(["details", "loaded"], true);
}

const PortfolioReducer = (state = initialState, action) => {
    // reset actions
    state = state
        .setIn(["coins", "validationErrors"], List([]))
        .setIn(["form", "errors"], List([]));

    switch (action.type) {
        case types.RETRIEVE_ITEMS_SUCCESS:
            CacheHelper.cache(COINS, action.body);
            return state
                .setIn(["coins", "items"], action.body)
                .setIn(["coins", "validationErrors"], action.body.map(coin => null))
                .setIn(["coins", "loaded"], true);

        case types.COIN_DETAILS_REQUEST:
            return state.setIn(["page", "isFetching"], true);

        case types.COIN_STATS_SUCCESS:
            return state.set("stats", action.body);

        case types.COIN_DETAILS_SUCCESS:
            let coinsMerged = action.body;
            // merge arrays
            if (
                state.details.get("coins") &&
                state.details.get("coins").length >= action.body.length
            ) {
                coinsMerged = state.details
                    .get("coins")
                    .map(coin =>
                        Object.assign(coin, action.body.find(c => c.coinId === coin.coinId)),
                    );
            }

            CacheHelper.cache(DETAILS, coinsMerged);

            return state
                .setIn(["details", "coins"], coinsMerged)
                .setIn(["details", "loaded"], true)
                .setIn(["page", "isFetching"], false);

        case types.COIN_DETAILS_FAILURE:
            return state.setIn(["page", "isFetching"], false);

        case types.COINS_ADD_REQUEST:
            return state.setIn(["form", "isSubmitting"], true);

        case types.COINS_ADD_SUCCESS:
        case types.COIN_UPDATE_SUCCESS:
        case types.COIN_DELETE_SUCCESS:
            CacheHelper.remove(DETAILS);
            return state
                .setIn(["coins", "items"], action.body)
                .setIn(["form", "isSubmitting"], false);

        case types.COINS_ADD_FAILURE:
            // filter out the index if exists
            let errors = {};
            for (let key in action.body) {
                errors[key.replace("0.", "")] = action.body[key];
            }

            return state.setIn(["form", "errors"], errors).setIn(["form", "isSubmitting"], false);

        case types.COIN_UPDATE_FAILURE:
            var changedErrors = [].concat(state.coins.get("validationErrors"));
            changedErrors[action.key] = action.body;
            return state.setIn(["coins", "validationErrors"], changedErrors);

        case LOGOUT:
            CacheHelper.remove(COINS);
            CacheHelper.remove(DETAILS);
            return new InitialState();

        default:
            return state;
    }
};

export default PortfolioReducer;

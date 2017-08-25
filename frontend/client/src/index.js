import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import CryptoBuyApp from "./app/CryptoBuyApp";
import rootReducer from "./app/reducers";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import injectTapEventPlugin from "react-tap-event-plugin";
import { syncHistoryWithStore } from "react-router-redux";
import { browserHistory } from "react-router";
import { unregister } from "./registerServiceWorker";

import "./index.scss";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

let store;
if (process.env.NODE_ENV === "development") {
    const logger = createLogger();
    const enhancer = compose(applyMiddleware(thunk, logger));
    store = createStore(
        rootReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        enhancer
    );
} else {
    const enhancer = applyMiddleware(thunk);
    store = createStore(rootReducer, enhancer);
}

const history = syncHistoryWithStore(browserHistory, store);

unregister();

render(
    <Provider store={store}>
        <CryptoBuyApp history={history} />
    </Provider>,
    document.getElementById("root")
);



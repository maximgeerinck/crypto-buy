import React, { Component } from "react";
import { Router } from "react-router";
import routes from "../routes";
import ReactGA from "react-ga";
import { browserHistory } from "react-router";
import "./index.scss";
import * as Constants from "./constants";
import { USER } from "../user/UserReducer";

const TRACKING_ID = Constants.TRACKING_ID;

ReactGA.initialize(TRACKING_ID);
window.cryptotrackr = {
    version: Constants.APP_VERSION,
    originalDocumentTitle: Constants.TITLE
};
const VERSION_KEY = "cryptotrackr_version";

class ImageRotatorApp extends Component {
    logPageView() {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }

    componentWillMount() {
        let userLoggedIn = localStorage.getItem(USER) != null;

        if (
            localStorage.getItem(VERSION_KEY) === null ||
            parseInt(localStorage.getItem(VERSION_KEY), 10) !== window.cryptotrackr.version
        ) {
            localStorage.clear();
            localStorage.setItem(VERSION_KEY, window.cryptotrackr.version);

            // only redirect if user key was found
            if (userLoggedIn) {
                browserHistory.replace("/");
            }
        }
    }

    render() {
        const { history } = this.props;

        return <Router history={history} routes={routes} onUpdate={this.logPageView} />;
    }
}

export default ImageRotatorApp;

import React, { Component } from "react";
import NavigationBar from "./NavigationBar";
import cx from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as UserActions from "../user/UserActions";
import * as AuthActions from "../authentication/AuthenticationActions";

// import ErrorContainer from "../error/ErrorContainer";
import page from "./page.scss";
import { browserHistory } from "react-router";
import FlashContainer from "../notification/FlashContainer";
import Feedback from "../feedback/Feedback";

class Page extends Component {
    componentDidMount() {
        if (!this.props.user.loaded && this.props.auth.isAuthenticated) {
            this.props.userActions.me();
        }
    }

    logout = () => {
        this.props.authActions.logout();
        browserHistory.replace("/");
    };

    render() {
        const isAuthenticated = this.props.auth.isAuthenticated;

        const className = this.props.className || null;
        const { navigationBar, children, title, custom } = this.props;
        const navbar = navigationBar ? (
            <NavigationBar isAuthenticated={isAuthenticated} onLogout={this.logout} />
        ) : null;
        const titleContainer = title ? <h1>{title}</h1> : null;

        const childrenWrapper = !custom ? <div className={page.content}>{children}</div> : children;

        return (
            <div className={cx(page.page, className)}>
                {navbar}
                <FlashContainer />
                <div className={page.body}>
                    {/* <ErrorContainer /> */}
                    {titleContainer}
                    {childrenWrapper}
                </div>

                <Feedback />

                <footer>
                    <p className={page.copyright}>
                        <a href="https://cryptotrackr.com">&copy; Cryptotrackr 2017</a>
                    </p>
                    {/* <SponsorEnjin /> */}
                    <ul className={page.donation}>
                        Support us by using one of the following currencies
                        <li>
                            Donate
                            <img
                                src="https://files.coinmarketcap.com/static/img/coins/16x16/ethereum.png"
                                alt="ethereum"
                            />
                            <span className={page.address}>
                                0x82C3CE03a9ed41DD047B7DD833751E031C451017
                            </span>
                        </li>
                        <li>
                            Donate
                            <img
                                src="https://files.coinmarketcap.com/static/img/coins/16x16/bitcoin.png"
                                alt="bitcoin"
                            />
                            <span className={page.address}>14FG4SPBZAECiogAB3a2KZqCQmBG2zh69Z</span>
                        </li>
                        <li>
                            Donate
                            <img
                                src="https://files.coinmarketcap.com/static/img/coins/16x16/litecoin.png"
                                alt="litecoin"
                            />
                            <span className={page.address}>LMQ1uyDeQRZa6y2J8nefwkzapfGLpHVDHN</span>
                        </li>
                    </ul>
                </footer>
            </div>
        );
    }
}

Page.propTypes = {
    navigationBar: PropTypes.bool.isRequired,
    title: PropTypes.string,
    custom: PropTypes.bool.isRequired,
    className: PropTypes.string,
};
Page.defaultProps = {
    navigationBar: true,
    custom: false,
};

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    app: state.app,
});

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(UserActions, dispatch),
        authActions: bindActionCreators(AuthActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);

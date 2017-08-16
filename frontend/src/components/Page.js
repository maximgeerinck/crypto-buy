import React, { Component } from "react";
import NavigationBar from "./NavigationBar";
import cx from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as UserActions from "../user/UserActions";
import ErrorContainer from "../error/ErrorContainer";
import page from "./page.scss";

class Page extends Component {
    componentDidMount() {
        if (this.props.auth.isAuthenticated && !this.props.user) {
            this.props.userActions.me();
        }
    }

    render() {
        const { dispatch, app } = this.props;
        const isAuthenticated = this.props.auth.isAuthenticated;

        const className = this.props.className || null;
        const { navigationBar, children, title, custom } = this.props;
        const navbar = navigationBar ? <NavigationBar dispatch={dispatch} isAuthenticated={isAuthenticated} /> : null;
        const titleContainer = title ? <h1>{title}</h1> : null;

        const childrenWrapper = !custom ? <div className={page.content}>{children}</div> : children;

        return (
            <div className={cx(page.page, className)}>
                {navbar}
                <div className={page.body}>
                    <ErrorContainer />
                    {titleContainer}
                    {childrenWrapper}
                </div>

                <footer>
                    <p className={page.copyright}>
                        <a href="https://cryptotrackr.com">&copy; Cryptotrackr 2017</a>
                    </p>
                    <p className={page.donation}>
                        Donation address:{" "}
                        <span className={page.address}>0x82C3CE03a9ed41DD047B7DD833751E031C451017</span>
                    </p>
                </footer>
            </div>
        );
    }
}

Page.propTypes = {
    navigationBar: PropTypes.bool.isRequired,
    title: PropTypes.string,
    custom: PropTypes.bool.isRequired,
    className: PropTypes.string
};
Page.defaultProps = {
    navigationBar: true,
    custom: false
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.user,
    app: state.app
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: dispatch,
        userActions: bindActionCreators(UserActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);

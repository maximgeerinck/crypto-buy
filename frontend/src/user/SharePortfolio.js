import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ShareActions from "../share/ShareActions";
import * as UserActions from "./UserActions";
import styles from "./share.scss";

import ShareItem from "./ShareItem";
import ShareForm from "./ShareForm";

class SharePortfolio extends Component {
    share = (options) => this.props.shareActions.share(options);
    deleteShare = (id) => this.props.shareActions.deleteShare(id);

    render() {
        const shares = this.props.user.get("user").get("shares");

        let shareContainers = shares.map((share) => {
            const permissions = Object.keys(share).filter((key) => typeof share[key] === "boolean" && share[key]);
            return (
                <ShareItem
                    key={share.id}
                    id={share.id}
                    permissions={permissions}
                    token={share.token}
                    onDelete={this.deleteShare}
                    onCopy={this.copyShare}
                />
            );
        });

        return (
            <div>
                <ShareForm onSave={this.share} latestShare={this.props.share.latestShare} />

                <h3>Your active share links</h3>
                <ul className={styles.shares}>{shareContainers}</ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    share: state.share
});

const mapDispatchToProps = (dispatch) => {
    return {
        shareActions: bindActionCreators(ShareActions, dispatch),
        userActions: bindActionCreators(UserActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePortfolio);

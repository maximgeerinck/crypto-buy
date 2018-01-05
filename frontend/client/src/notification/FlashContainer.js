import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as NotificationActions from "./NotificationActions";
import FlashMessage from "./FlashMessage";
import * as CacheHelper from "../helpers/CacheHelper";

const KEY_NOTIFICATION_MUTED = "notification/muted";

class FlashNotification extends Component {

    componentWillMount() {
        if (!this.props.notification.loaded) {
            this.props.notificationActions.loadNotifications();
        }
    }

  dismiss = (notificationId) => {
      let muted = [];
      if (CacheHelper.getCache(KEY_NOTIFICATION_MUTED)) {
          muted = CacheHelper.getCache(KEY_NOTIFICATION_MUTED);
      }
      muted.push(notificationId);
      CacheHelper.cache(KEY_NOTIFICATION_MUTED, muted, CacheHelper.DAY);
      this.forceUpdate();
  }

  render() {

      if (!this.props.notification.loaded) return <div />;

      const muted = CacheHelper.getCache(KEY_NOTIFICATION_MUTED) || [];

      const notifications = this.props.notification.flashMessages;

      const messages = notifications
          .filter((n) => muted.indexOf(n.id) === -1)
          .map((notification) => <FlashMessage notification={notification} onDismiss={this.dismiss} />)

      return (
        <div>{messages}</div>
      );
  }
}

const mapStateToProps = (state) => ({
    notification: state.notification
});

const mapDispatchToProps = (dispatch) => {
    return {
        notificationActions: bindActionCreators(NotificationActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashNotification);
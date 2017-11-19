import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import styles from "./feedback.scss";
import FeedbackComponent from "./FeedbackComponent";
import FeedbackForm from "./FeedbackForm";
import * as FeedbackActions from "./FeedbackActions";
import cx from "classnames";
import FontAwesome from "react-fontawesome";
import * as FeedbackHelper from "./FeedbackHelper";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      showForm: false,
      collapsed: props.feedback.collapsed,
      submitted: false
    };
  }

  change = (oldRating, newRating) => {
    this.setState({ rating: newRating });
    this.props.feedbackActions.submit(newRating);
    setTimeout(this.props.feedbackActions.collapse, 5000);
  };

  toggleCollapse = () => {
    const collapsed = !this.props.feedback.collapsed;
    this.setState({ collapsed });
  };

  showForm = () => this.setState({ showForm: !this.state.showForm });

  isFormShown = () => {
    return FeedbackHelper.ratingIsToLow(this.state.rating) || this.state.showForm;
  };

  submitForm = data => {
    let feedback = this.props.feedback.lastFeedback;
    feedback = { ...feedback, ...data };
    this.props.feedbackActions.update(feedback);
    setTimeout(this.props.feedbackActions.collapse, 5000);
    this.setState({ submitted: true });
  };

  renderThankYou = () => {
    return (
      <p className={styles.thanks}>
        <FontAwesome name="check" className={styles.thanksIcon} />Thank you!
      </p>
    );
  };

  render() {
    const { rating, collapsed, submitted } = this.state;
    const headerMessage = rating != 0 && FeedbackHelper.ratingIsToLow(rating) ? "What could we improve?" : undefined;
    const form =
      this.isFormShown() && !submitted ? (
        <FeedbackForm onSubmit={this.submitForm} headerMessage={headerMessage} />
      ) : (
        undefined
      );
    const submittedMessage = submitted ? this.renderThankYou() : undefined;
    const activeStyle = form ? styles.active : undefined;
    const collapsedStyle = collapsed ? styles.collapsed : undefined;
    const feedbackComponent = !this.isFormShown() ? (
      <FeedbackComponent onRatingChange={this.change} sent={this.props.feedback.sent} onAttachMessage={this.showForm} />
    ) : (
      undefined
    );

    return (
      <div className={cx(styles.feedback, activeStyle, collapsedStyle)}>
        {feedbackComponent}
        {form}
        {submittedMessage}
        <button className={styles.toggleCollapse} onClick={this.toggleCollapse}>
          <FontAwesome name="comments-o" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feedback: state.feedback
});

const mapDispatchToProps = dispatch => {
  return {
    feedbackActions: bindActionCreators(FeedbackActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);

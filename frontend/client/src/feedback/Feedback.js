import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import styles from "./feedback.scss";
import FeedbackForm from "./FeedbackForm";
import * as FeedbackActions from "./FeedbackActions";
import cx from "classnames";
import FontAwesome from "react-fontawesome";
import * as FeedbackHelper from "./FeedbackHelper";
import Rating from "./Rating";
import CollapsedRating from "./CollapsedRating";
import ThankYou from "./ThankYou";

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            showForm: false,
            submitted: false
        };
        this.timer = undefined;
    }

    toggleCollapse = () => {
        const collapsed = !this.props.feedback.collapsed;
        this.props.feedbackActions.toggle(collapsed);
    };

    attachMessage = () => this.state.showForm;
    showForm = () => {
        clearInterval(this.timer);
        this.setState({ showForm: !this.state.showForm });
    };
    submitted = () => this.state.submitted;
    isRatingToLow = rating => rating <= 2;

    submitForm = data => {
        let feedback = this.props.feedback.lastFeedback;
        feedback = { ...feedback, ...data };
        this.props.feedbackActions.update(feedback);
        this.timer = setTimeout(this.props.feedbackActions.collapse, 3000);
        this.setState({ submitted: true, showForm: false });
    };

    onRate = rating => {
        const obj = { rating };
        if (this.isRatingToLow(rating)) {
            obj.showForm = true;
        } else {
            this.props.feedbackActions.submit(rating);
            obj.submitted = true;
            obj.showForm = false;
            this.timer = setTimeout(this.props.feedbackActions.collapse, 3000);
        }

        this.setState(obj);
    };

    hidden() {
        return this.props.feedback.collapsed;
    }

    renderWrapper(content) {
        const { rating, submitted } = this.state;
        const { collapsed } = this.props.feedback;

        const form = this.attachMessage();
        const activeStyle = form ? styles.active : undefined;
        const collapsedStyle = collapsed ? styles.collapsed : undefined;
        return <div className={cx(styles.feedback, activeStyle, collapsedStyle)}>{content}</div>;
    }

    //TODO: Rewrite to state pattern
    render() {
        const { rating, collapsed, submitted } = this.state;

        // did you already submit a form? don't show
        if (this.hidden()) {
            return this.renderWrapper(<CollapsedRating toggle={this.toggleCollapse} />);
        }

        if (this.attachMessage()) {
            return this.renderWrapper(
                <FeedbackForm onSubmit={this.submitForm} headerMessage={"What could we improve?"} />
            );
        }

        if (this.submitted()) {
            return this.renderWrapper(<ThankYou onAttachMessage={this.showForm} />);
        }

        return this.renderWrapper(<Rating onRate={this.onRate} />);
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

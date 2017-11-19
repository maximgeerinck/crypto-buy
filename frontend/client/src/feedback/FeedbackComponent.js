import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";

import styles from "./feedback.scss";

class FeedbackComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      ratingMessages: ["Terrible", "Bad", "Okay", "Good", "Great"],
      highlighting: false,
      confirmed: false,
      confirmedRating: 0
    };
  }

  isHighlighted(rating) {
    return this.state.rating >= rating && (this.state.confirmed || this.state.highlighting)
      ? styles.highlighted
      : undefined;
  }

  highlight = rating => {
    this.setState({ rating, highlighting: true });
  };

  confirmRating = i => {
    const { confirmedRating, confirmed } = this.state;
    const c = i === confirmedRating ? !confirmed : true;

    this.props.onRatingChange(this.state.rating, i);
    this.setState({ rating: i, confirmed: c, confirmedRating: i });
    return 0;
  };

  resetRating = () => {
    if (!this.state.confirmed) {
      this.setState({ rating: 0, highlighting: false });
    } else {
      this.setState({ rating: this.state.confirmedRating, highlighting: false });
    }
  };

  renderStars() {
    const { ratingMessages, rating } = this.state;
    return ratingMessages.map((message, i) => {
      i = i + 1;
      return (
        <li
          key={i}
          className={this.isHighlighted(i)}
          onClick={() => this.confirmRating(i)}
          onMouseLeave={this.resetRating}
          onMouseEnter={() => this.highlight(i)}
        >
          <FontAwesome name="star" />
          {rating === i ? <span className={styles.message}>{message}</span> : undefined}
        </li>
      );
    });
  }

  renderMessage() {
    return (
      <div className={styles.sent}>
        <p>Sent!</p>
        <button onClick={this.props.onAttachMessage}>Want to attach a message?</button>
      </div>
    );
  }

  render() {
    const content = !this.props.sent ? <ul className={styles.rating}>{this.renderStars()}</ul> : this.renderMessage();
    return content;
  }
}

FeedbackComponent.propTypes = {
  onRatingChange: PropTypes.func,
  sent: PropTypes.bool.isRequired,
  onAttachMessage: PropTypes.bool.func
};

FeedbackComponent.defaultProps = {
  sent: false
};

export default FeedbackComponent;

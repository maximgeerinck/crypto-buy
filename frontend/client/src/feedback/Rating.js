import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styles from "./feedback.scss";

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratingMessages: ["Terrible", "Bad", "Okay", "Good", "Great"],
            highlighting: false,
            highlightingRating: 0
        };
    }

    isHighlighted(rating) {
        return this.state.highlightingRating >= rating ? styles.highlighted : undefined;
    }

    rate = rating => {
        this.props.onRate(rating);
    };

    highlight = rating => {
        this.setState({ highlightingRating: rating, highlighting: true });
    };

    renderStars() {
        const { ratingMessages, highlightingRating } = this.state;
        return ratingMessages.map((message, i) => {
            i = i + 1;
            return (
                <li
                    key={i}
                    className={this.isHighlighted(i)}
                    onClick={() => this.rate(i)}
                    onMouseLeave={this.resetRating}
                    onMouseEnter={() => this.highlight(i)}
                >
                    <FontAwesome name="star" />
                    {highlightingRating === i ? <span className={styles.message}>{message}</span> : undefined}
                </li>
            );
        });
    }

    render() {
        return <ul className={styles.rating}>{this.renderStars()}</ul>;
    }
}

Rating.propTypes = {
    onChange: PropTypes.func
};

export default Rating;

import React, { Component } from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import styles from "./feedback.scss";

class CollapsedRating extends Component {
    render() {
        return (
            <button className={styles.toggleCollapse} onClick={this.props.toggle}>
                <FontAwesome name="comments-o" />
          </button>
        );
    }
}

CollapsedRating.propTypes = {
    toggle: PropTypes.func
};

export default CollapsedRating;

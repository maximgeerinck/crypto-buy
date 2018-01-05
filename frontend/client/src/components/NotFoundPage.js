import React from "react";
import Page from "./Page";
import PropTypes from "prop-types";
import { Link } from "react-router";
import formStyles from "../forms.scss"
import cx from "classnames";

class NotFoundPage extends React.Component {
    render() {
        const { text, title, className } = this.props;
        return (
          <Page title={title} className={className}>
              <p>{text}</p>
              <div>
                  <Link to="/" className={cx(formStyles.button, formStyles.info)}>Home</Link>
                </div>
            </Page>
        );
    }
}

NotFoundPage.propTypes = {
    text: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string
};

NotFoundPage.defaultProps = {
    text: "Could not find the request page.",
    title: "404 - Not Found"
};

export default NotFoundPage;

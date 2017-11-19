import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./feedback.scss";
import formStyles from "../forms.scss";

class FeedbackForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        message: ""
      }
    };
  }

  submit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.form);
    return 0;
  };

  changeForm = (attr, value) => {
    let form = this.state.form;
    form[attr] = value;
    this.setState({ form });
  };

  renderHeader = () => {
    return this.props.headerMessage ? (
      <h3>{this.props.headerMessage}</h3>
    ) : (
      <h3>Which message would you like to send us?</h3>
    );
  };

  render() {
    const { message } = this.state.form;
    const header = this.renderHeader();

    return (
      <form className={formStyles.form} onSubmit={this.submit}>
        {header}
        <div className={formStyles.group}>
          <textarea value={message} onChange={e => this.changeForm("message", e.target.value)} />
        </div>
        <div className={formStyles.group}>
          <button type="submit" className={formStyles.button}>
            Submit feedback
          </button>
        </div>
      </form>
    );
  }
}

FeedbackForm.propTypes = {
  onSubmit: PropTypes.func,
  headerMessage: PropTypes.string
};

export default FeedbackForm;

import React, { Component } from "react";
import PropTypes from "prop-types";
import formStyles from "../forms.scss";
import ValidationHelper from "../helpers/ValidationHelper";

class InputWithLabel extends Component {
    renderDisplay() {
        const name = this.props.name;
        return name.replace(/-/g, " ").replace(/_/g, " ");
    }

    change = e => {
        return this.props.onChange(e.target.value, e);
    };

    renderValidation() {
        const { validation } = this.props;
        const display = this.renderDisplay();
        if (validation) {
            return (
                <span className={formStyles.validationError}>
                    {ValidationHelper.parse(validation, validation.path, [display])}
                </span>
            );
        }
    }

    renderDescription() {
        if (this.props.children) {
            return <p className={formStyles.descriptor}>{this.props.children}</p>;
        }
    }

    renderLabel() {
        const viewText = this.renderDisplay();
        if (this.props.display) {
            return <label htmlFor="name">{viewText}:</label>;
        }
    }

    render() {
        const { name, type } = this.props;

        const { display, children, validation, ...attributes } = this.props;
        const validationMessage = this.renderValidation();
        const description = this.renderDescription();
        const label = this.renderLabel();

        const field =
            type === "textarea" ? (
                <textarea id={name} {...attributes} onChange={this.change} />
            ) : (
                <input type="text" id={name} {...attributes} onChange={this.change} />
            );

        return (
            <div className={formStyles.group}>
                {label}
                {field}
                {description}
                {validationMessage}
            </div>
        );
    }
}

InputWithLabel.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    type: PropTypes.string,
};

export default InputWithLabel;

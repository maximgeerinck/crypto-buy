import React, { Component } from "react";
import PropTypes from "prop-types";

import ShareOption from "./ShareOption";
import formStyles from "../forms.scss";
import cx from "classnames";
import styles from "./share.scss";

class ShareForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                graph: false,
                price: false,
                change: false,
                amount: false
            }
        };
    }

    onChangeOption = (key) => {
        let options = this.state.options;
        options[key] = !options[key];
        this.setState({ options: options });
    };

    onSave = (e) => {
        e.preventDefault();
        this.props.onSave(this.state.options);
        return 0;
    };

    render() {
        const { options } = this.state;
        const { latestShare } = this.props;

        const inputText = latestShare.token ? latestShare.token : "Generate your unique share link!";

        return (
            <form className={formStyles.form} onSubmit={this.onSave}>
                <p>Select your options you want to show and press generate to create a shared link</p>
                <div className={cx(formStyles.group, formStyles.inline, styles.share)}>
                    <button type="submit" className={formStyles.button} ref="copyButton">
                        Generate & Copy
                    </button>
                    <input type="url" value={inputText} disabled ref="shareUrl" />
                </div>
                <div className={cx(formStyles.group, formStyles.inline)}>
                    <ShareOption text="Graph" enabled={options.graph} onToggle={(_) => this.onChangeOption("graph")} />
                    <ShareOption text="Price" enabled={options.price} onToggle={(_) => this.onChangeOption("price")} />
                    <ShareOption
                        text="Change"
                        enabled={options.change}
                        onToggle={(_) => this.onChangeOption("change")}
                    />
                    <ShareOption
                        text="Amount"
                        enabled={options.amount}
                        onToggle={(_) => this.onChangeOption("amount")}
                    />
                </div>
            </form>
        );
    }
}

ShareForm.propTypes = {
    onSave: PropTypes.func,
    latestShare: PropTypes.object
};

export default ShareForm;

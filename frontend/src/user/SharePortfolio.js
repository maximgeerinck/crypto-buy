import React, { Component } from "react";
import PropTypes from "prop-types";
import formStyles from "../forms.scss";
import styles from "./share.scss";
import cx from "classnames";
import Clipboard from "clipboard";
import ShareOption from "./ShareOption";

class SharePortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                source: false,
                price: false,
                boughtAt: false,
                amount: false
            }
        };
    }

    componentDidMount() {
        new Clipboard(this.refs.copyButton, {
            text: (trigger) => {
                return this.refs.shareUrl.value;
            }
        });
    }

    share = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.props.onGenerate(this.state.options);
        return 0;
    };

    copy = (e) => {
        e.preventDefault();
        const url = this.refs.shareUrl.value;
        this.refs.shareUrl.value = "Copied!";
        setTimeout(() => {
            this.refs.shareUrl.value = url;
        }, 1000);
    };

    onChangeOption = (key) => {
        let options = this.state.options;
        options[key] = !options[key];
        this.setState({ options: options });
        if (this.props.settings.token !== undefined) {
            this.share();
        }
    };

    render() {
        const { token } = this.props.settings;
        const { options } = this.state;
        const generated = token !== undefined;

        const buttonText = generated ? "Copy" : "Generate";
        const formAction = generated ? this.copy : this.share;
        const inputText = generated ? `https://cryptotrackr.com/share/${token}` : "Generate your unique share link!";

        return (
            <form className={formStyles.form} onSubmit={formAction}>
                <div className={cx(formStyles.group, formStyles.inline, styles.share)}>
                    <button type="submit" className={formStyles.button} ref="copyButton">
                        {buttonText}
                    </button>
                    <input type="url" value={inputText} disabled ref="shareUrl" />
                </div>
                <div className={cx(formStyles.group, formStyles.inline)}>
                    <ShareOption text="Price" enabled={options.price} onToggle={(_) => this.onChangeOption("price")} />
                    <ShareOption
                        text="Purchase date"
                        enabled={options.boughtAt}
                        onToggle={(_) => this.onChangeOption("boughtAt")}
                    />
                    <ShareOption
                        text="Source"
                        enabled={options.source}
                        onToggle={(_) => this.onChangeOption("source")}
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

SharePortfolio.propTypes = {
    settings: PropTypes.object.isRequired,
    onGenerate: PropTypes.func.isRequired
};

export default SharePortfolio;

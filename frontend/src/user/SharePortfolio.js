import React, { Component } from "react";
import PropTypes from "prop-types";
import formStyles from "../forms.scss";
import styles from "./share.scss";
import cx from "classnames";
import Clipboard from "clipboard";

class SharePortfolio extends Component {
    componentDidMount() {
        new Clipboard(this.refs.copyButton, {
            text: (trigger) => {
                return this.refs.shareUrl.value;
            }
        });
    }

    share = (e) => {
        e.preventDefault();
        this.props.onGenerate({ source: false, price: false, boughtAt: false, amount: false });
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

    render() {
        const { token } = this.props.settings;
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
                {/* <div className={cx(formStyles.group, formStyles.inline)}>
                    <input type="checkbox" checked="false" /> Show Price
                    <input type="checkbox" checked="false" /> Show Purchase Date
                    <input type="checkbox" checked="false" /> Show Source
                    <input type="checkbox" checked="false" /> Show Amount
                </div> */}
            </form>
        );
    }
}

SharePortfolio.propTypes = {
    settings: PropTypes.object.isRequired,
    onGenerate: PropTypes.func.isRequired
};

export default SharePortfolio;

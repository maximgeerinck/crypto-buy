import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./share.scss";
import formStyles from "../forms.scss";
import Clipboard from "clipboard";
import cx from "classnames";
import PortfolioBanner from "../portfolio/PortfolioBanner";

class ShareItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  componentDidMount() {
    new Clipboard(this.refs.copyButton, {
      text: (trigger) => {
        return `https://cryptotrackr.com/share/${this.props.token}`;
      }
    });

    new Clipboard(this.refs.copyItem, {
      text: (trigger) => {
        return `https://cryptotrackr.com/share/${this.props.token}`;
      }
    });


  }

  copy = () => {
    setTimeout(() => {
      this.setState({ copied: false });
    }, 1000);
    this.setState({ copied: true });
  };

  render() {
    const { token, onDelete, id, permissions } = this.props;
    const c = this.state.copied ? cx(styles.itemCopied, styles.show) : styles.itemCopied;

    const shows = permissions.length > 0 ? permissions.join(", ") : "nothing extra";


    return (
      <li>
        <div className={styles.info}>
            <div>
                <p ref="copyItem" onClick={() => this.copy()}>
                    {token}
                </p>
                <span className={styles.permissions}>Shows {shows}</span>
            </div>
            <div className={styles.shareActions}>
                <button onClick={() => onDelete(id)} className={cx(formStyles.button, formStyles.danger)}>
                    Revoke
                </button>
                <button
                    ref="copyButton"
                    onClick={() => this.copy()}
                    className={cx(formStyles.button, formStyles.info)}
                >
                    Copy
                </button>
            </div>
        </div>
        <PortfolioBanner share={token} className={styles.banner} />
        <div className={c}>Copied</div>
    </li>
    );
  }
}

ShareItem.propTypes = {
  token: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  id: PropTypes.string.isRequired,
  permissions: PropTypes.array.isRequired,
  items: PropTypes.object
};

ShareItem.defaultProps = {
  permissions: []
};

export default ShareItem;
import React, { Component } from "react";
import PropTypes from "prop-types";
import Clipboard from "clipboard";
import { BASE_PATH } from "../app/constants";

import formStyles from "../forms.scss";
import styles from "./banner.scss";
import cx from "classnames";

class PortfolioBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false,
        };
    }

    componentDidMount() {
        new Clipboard(this.refs.copyBanner, {
            text: trigger => {
                return `${BASE_PATH}banner/${this.props.share}`;
            },
        });

        new Clipboard(this.refs.embed, {
            text: trigger => {
                return `[url=https://cryptotrackr.com/share/${
                    this.props.share
                }][img]${BASE_PATH}banner/${this.props.share}[/img][/url]`;
            },
        });
    }

    copy = () => {
        setTimeout(() => {
            this.setState({ copied: false });
        }, 1000);
        this.setState({ copied: true });
    };

    render() {
        const { share } = this.props;

        const props = { ...this.props };
        delete props["share"];

        const copied = this.state.copied ? <div className={styles.copied}>Copied</div> : undefined;

        return (
            <div className={styles.banner}>
                <img
                    src={`${BASE_PATH}banner/${share}`}
                    alt={share}
                    ref="copyBanner"
                    {...props}
                    onClick={this.copy}
                />
                <div className={styles.shareActions}>
                    <button ref="embed" className={cx(formStyles.button, formStyles.info)}>
                        Embed code
                    </button>
                </div>
                {copied}
            </div>
        );
    }
    // renderItems() {
    //   const { items } = this.props;

    //   return Object.keys(items).map((key) => {
    //     const coin = items[key];
    //     const posOrNeg = coin.change.percentDay < 0 ? styles.negative : styles.positive;

    //     return (
    //       <li key={key}>
    //           <img src={CoinHelper.getCoinImage(coin.coinId)} alt={coin.coinId} />
    //           <div className={styles.details}>
    //               <h4>{coin.name}</h4>
    //               <p className={posOrNeg}>{MathHelper.formatSigned(coin.change.percentDay)}</p>
    //           </div>
    //       </li>
    //     )
    //   })
    // }

    // render() {

    //   const itemContainers = this.renderItems();
    //   return (
    //     <ul className={styles.banner} id="temp-banner">
    //       {itemContainers}
    //     </ul>
    //   );
    // }
}

PortfolioBanner.propTypes = {
    share: PropTypes.string.isRequired,
};

export default PortfolioBanner;

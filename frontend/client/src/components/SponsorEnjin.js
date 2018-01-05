import React, { Component } from "react";
import enjinImage from "./enjin.png";
import styles from "./enjin.scss";

class SponsorEnjin extends Component {
    render() {
        return (
            <a href="https://crowdsale.enjin.com/" className={styles.sponsor}>
                <img src={enjinImage} alt="enjin" />
                <p>
                    Sponsored by Enjin Coin <br /> "Smart Cryptocurrency for Gaming"
              </p>
          </a>
        );
    }
}

export default SponsorEnjin;

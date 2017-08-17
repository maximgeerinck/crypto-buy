import * as moment from "moment";
import * as schedule from "node-schedule";
import * as request from "superagent";
import Coin from "../models/Coin";

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const API = "https://api.coinmarketcap.com/v1/";
const ETH_ENDPOINT = API + "/ticker";

export const fetchPrice = async () => {
    request
        .get(ETH_ENDPOINT)
        .then((data: any) => {
            // save response
            const coins = data.body.map((coin: any) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                rank: coin.rank,
                price: {
                    usd: coin.price_usd,
                    btc: coin.price_btc
                },
                market_cap: {
                    usd: coin.market_cap_usd
                },
                supply: {
                    available: coin.available_supply,
                    total: coin.total_supply
                },
                change: {
                    percent_1h: coin.percent_change_1h,
                    percent_24h: coin.percent_change_24h,
                    percent_7d: coin.percent_change_7d
                },
                timestamp: coin.timestamp
            }));

            const coin = new Coin({ coins });
            coin.save();
        })
        .catch((err: any) => {
            console.log(err);
        });
};

class PriceTask {
    public start() {
        // execute every 1min
        schedule.scheduleJob("*/1 * * * *", () => {
            // console.log(`${moment.now()}: fetching...`);
            fetchPrice();
        });
    }
}

export default PriceTask;

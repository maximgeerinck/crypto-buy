import * as moment from "moment";
import * as schedule from "node-schedule";
import * as request from "superagent";
import { Coin } from "../coin/Coin";
import { CoinCollection } from "../coin/CoinCollection";
import CoinCollectionRepository from "../coin/CoinCollectionRepository";

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const API = "https://api.coinmarketcap.com/v1/";
const ETH_ENDPOINT = API + "/ticker?limit=10000";

export const fetchPrice = async () => {
    request
        .get(ETH_ENDPOINT)
        .then((data: any) => {
            // save response
            const coins = data.body.map((coin: any) => {
                const coinObject = new Coin(coin.id, coin.name, coin.symbol);
                coinObject.rank = Number(coin.rank);
                coinObject.price = {
                    btc: Number(coin.price_btc),
                    usd: Number(coin.price_usd)
                };
                coinObject.volume = coin["24h_volume_usd"];
                coinObject.marketCap = Number(coin.market_cap_usd);
                coinObject.supply = {
                    total: Number(coin.total_supply),
                    available: Number(coin.available_supply)
                };
                coinObject.change = {
                    percentHour: coin.percent_change_1h,
                    percentDay: coin.percent_change_24h,
                    percentWeek: coin.percent_change_7d
                };
                coinObject.timestamp = coin.timestamp;
                return coinObject;
            });

            const collection = new CoinCollection(coins);
            return CoinCollectionRepository.create(collection);
        })
        .catch((err: any) => {
            if(err.status && err.status === 503) {
                console.log(`[Price task] Service Unavailable`);
            } else {
                console.log(err);
            }            
        });
};

class PriceTask {
    public start() {
        // start up fetch        
        fetchPrice();
        // execute every 5min
        schedule.scheduleJob("*/5 * * * *", () => {
            // console.log(`${moment.now()}: fetching...`);
            fetchPrice();
        });
    }
}

export default PriceTask;

import * as moment from "moment";
import * as schedule from "node-schedule";
import * as request from "superagent";
import { Coin } from "../coin/Coin";
import CoinRepository, { CACHE_COINS_TODAY, cacheKeyCoin } from "../coin/CoinRepository";
import mongoose from "../db";
import * as CacheHelper from "../utils/CacheHelper";

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const API = "https://api.coinmarketcap.com/v1/";
const ETH_ENDPOINT = API + "/ticker?limit=10000";

export const fetchPrice = async () => {

    console.time("FETCH_PRICE");
    const response = await request.get(ETH_ENDPOINT);
    console.timeEnd("FETCH_PRICE");

    console.time("map");
    const responseCoinMap: any = {};

//     FETCH_PRICE: 343.379ms
//     map: 4.316ms
//     existing: 107.632ms
    for (const coin of response.body) {
        const coinObject = new Coin(coin.id, coin.name, coin.symbol);
        coinObject.rank = Number(coin.rank);
        coinObject.history = [{
            timestamp: new Date(),
            btc: Number(coin.price_btc),
            usd: Number(coin.price_usd),
            change: {
                percentHour: coin.percent_change_1h,
                percentDay: coin.percent_change_24h,
                percentWeek: coin.percent_change_7d
            }
        }];
        coinObject.volume = coin["24h_volume_usd"];
        coinObject.marketCap = Number(coin.market_cap_usd);
        coinObject.supply = {
            total: Number(coin.total_supply),
            available: Number(coin.available_supply)
        };
        coinObject.timestamp = coin.timestamp;
        responseCoinMap[coin.id] = coinObject;
    }

    console.timeEnd("map");

    // check if record for today exists, then append it (can be random)
    console.time("existing");
    CacheHelper.invalidate(CACHE_COINS_TODAY);
    const existingCoins: any[] = await CoinRepository.existingCoinToday();
    console.timeEnd("existing");

    // console.log(existingCoins);
    if (!existingCoins || !existingCoins.length) {
        const array = Object.keys(responseCoinMap).map((key: string) => responseCoinMap[key]);
        CoinRepository.createMany(array);
    } else {
        for (const coin of existingCoins) {
            const c = responseCoinMap[coin.coinId];
            if (c) {
                CoinRepository.addHistoryEntry(coin._id, { ...c.history[0] });
            } else {
                console.log(`Coin doesn't exist: ${coin.coinId}`);
            }

        }
    }

    // create cache entry for each coin
    for (const coin of existingCoins) {
        CoinRepository.findCoinToday(coin.coinId);
    }
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

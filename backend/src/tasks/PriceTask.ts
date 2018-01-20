import * as moment from "moment";
import * as schedule from "node-schedule";
import * as request from "superagent";
import { Coin } from "../coin/Coin";
import CoinRepository from "../coin/CoinRepository";

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const API = "https://api.coinmarketcap.com/v1/";
const ETH_ENDPOINT = API + "/ticker?limit=10000";

export const fetchPrice = async () => {

    const response = await request.get(ETH_ENDPOINT);

    const coins = response.body.map((coin: any) => {
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
        return coinObject;
    });

    // check if record for today exists, then append it (can be random)
    const existingCoins: Coin[] = await CoinRepository.existingCoinToday();
    // console.log(existingCoins);
    if (!existingCoins || !existingCoins.length) {
        console.log("creating many");
        CoinRepository.createMany(coins);
    } else {
        console.log("exists, appending");
        for (const coin of coins) {
            CoinRepository.addHistoryEntry(coin.coinId, { ...coin.history[0] });
            // const coin = coins.find((c: any) => c.coinId === existingCoin.coinId );
            // existingCoin.history.push({ ...coin.price, timestamp: Date.now() });
            // CoinRepository.update(existingCoin.id, existingCoin);
        }
    }

    // request
    //     .get(ETH_ENDPOINT)
    //     .then((data: any) => {
    //         // save response
    //         const coins = data.body.map((coin: any) => {
    //             const coinObject = new Coin(coin.id, coin.name, coin.symbol);
    //             coinObject.rank = Number(coin.rank);
    //             coinObject.price = {
    //                 btc: Number(coin.price_btc),
    //                 usd: Number(coin.price_usd)
    //             };
    //             coinObject.volume = coin["24h_volume_usd"];
    //             coinObject.marketCap = Number(coin.market_cap_usd);
    //             coinObject.supply = {
    //                 total: Number(coin.total_supply),
    //                 available: Number(coin.available_supply)
    //             };
    //             coinObject.change = {
    //                 percentHour: coin.percent_change_1h,
    //                 percentDay: coin.percent_change_24h,
    //                 percentWeek: coin.percent_change_7d
    //             };
    //             coinObject.timestamp = coin.timestamp;
    //             return coinObject;
    //         });

    //         const collection = new CoinCollection(coins);
    //         return CoinCollectionRepository.create(collection);
    //     })
    //     .catch((err: any) => {
    //         if (err.status && err.status === 503) {
    //             console.log(`[Price task] Service Unavailable`);
    //         } else {
    //             console.log(`[Price task] Service Unavailable ${err.substr(0, 20)}`);
    //         }
    //     });
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

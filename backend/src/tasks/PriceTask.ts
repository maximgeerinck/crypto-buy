import * as moment from "moment";
import * as schedule from "node-schedule";
import * as request from "superagent";
import { Coin } from "../coin/Coin";
import CoinRepository, { CACHE_COINS_TODAY } from "../coin/CoinRepository";
import mongoose from "../db";
import * as CacheHelper from "../utils/CacheHelper";
import { batch } from "../utils/DownloadHelper";

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
// const API = "https://api.coinmarketcap.com/v1/";
// const ETH_ENDPOINT = API + "/ticker?limit=10000";

const composeApi = (page: number) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=${page}`;

export const fetchPrice = async () => {
    const response = await request.get("https://api.coingecko.com/api/v3/coins/list");
    const amountOfCoins = response.body.length;

    const pages = amountOfCoins / 100;
    const pricePromises: any = [];
    const responseCoinMap: any = {};

    for (let i = 1; i <= pages; i++) {
        pricePromises.push(async () => {
            const res = await request.get(composeApi(i));

            if (res.status !== 200) {
                return;
            }

            for (const coin of res.body) {
                const coinObject = new Coin(coin.id, coin.name, coin.symbol);
                coinObject.image = coin.image;
                coinObject.rank = Number(coin.market_cap_rank);
                coinObject.history = [
                    {
                        timestamp: new Date(),
                        usd: Number(coin.current_price),
                        change: {
                            percentDay: coin.price_change_percentage_24h,
                        },
                    },
                ];
                coinObject.marketCap = Number(coin.market_cap);
                coinObject.supply = {
                    total: Number(coin.total_supply),
                    available: Number(coin.circulating_supply),
                };
                coinObject.timestamp = coin.last_updated;
                responseCoinMap[coin.id] = coinObject;
            }
        });
    }

    await batch(pricePromises, 5, 500);

    // check if record for today exists, then append it (can be random)
    CacheHelper.invalidate(CACHE_COINS_TODAY);
    const existingCoins: any[] = await CoinRepository.existingCoinToday();

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

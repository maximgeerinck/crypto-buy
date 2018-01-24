import * as bluebird from "bluebird";
import * as flatten from "flat";
import * as moment from "moment";
import * as redis from "redis";
import mongoose from "../db";
import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
import { MongoRepository } from "../services/NewRepository";
import * as CacheHelper from "../utils/CacheHelper";
import CoinModel, { Coin } from "./Coin";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient({ host: "redis", port: 6379 }) as any;

interface ICoinStatistic {
    [key: string]: {
        [date: string]: number;
    };
}

const CACHE_COINS_ALL: string = "coins/all";
const CACHE_COINS_STATS_WEEK: string = "coins/stats/week";
const CACHE_COINS_TODAY: string = "coins/today";

class CoinRepository extends MongoRepository<Coin> {
    constructor() {
        super(CoinModel, "Coin");
    }

    public async findAllWithHistory(): Promise<any> {
        let allCoins: any = await CacheHelper.get(CACHE_COINS_ALL);
        if (allCoins) {
            return Promise.resolve(allCoins);
        }

        allCoins = await this.findAllToday();
        const coinMap: any = {};
        for (const coin of allCoins) {
            const history = coin.history.splice(coin.history.length >= 3 ? coin.history.length - 3 : 0);
            coinMap[coin.coinId] = {...coin, history};
        }

        CacheHelper.cache(CACHE_COINS_ALL, coinMap, CacheHelper.MIN);

        return Promise.resolve(coinMap);
    }

    public async findAllToday(): Promise<Coin[]> {

        const coinsToday: any = await CacheHelper.get(CACHE_COINS_TODAY);
        if (coinsToday) {
            return Promise.resolve(coinsToday);
        }

        const start = moment().startOf("day");
        const end = moment().endOf("day");
        const self = this;
        const daos = await this.model.find({ created_on: { $gte: start, $lt: end }});
        const objs = daos.map((dao: any) => self.parse(dao));
        CacheHelper.cache(CACHE_COINS_TODAY, objs, CacheHelper.HOUR * 2);

        return Promise.resolve(objs);
    }

    public async findDistinctMappedBySymbol(): Promise<any> {
        const map = await this.findAllWithHistory();
        const newMap: any = {};
        Object.keys(map).forEach((key: string) => {
            const coin: any = map[key];
            newMap[coin.symbol] = coin;
        });

        return newMap;
    }

    public async findDistinctMappedByIdentifier(): Promise<any> {
        const map = await this.findAllWithHistory();
        const newMap: any = {};
        Object.keys(map).forEach((key: string) => {
            const coin: any = map[key];
            newMap[coin.coinId] = coin;
        });

        return newMap;
    }

    public async existingCoinToday(): Promise<Coin[]> {
        try {
            const exists = await this.findAllToday();
            if (!exists) {
                return Promise.resolve(null);
            }
            return Promise.resolve(exists);
        } catch (ex) {
            return Promise.resolve(null);
        }
    }

    public async addHistoryEntry(id: any, entry: any): Promise<Coin> {
        return this.model.update({ _id: id }, { $push: {history: entry }});
    }

    public async stats(): Promise<any> {

        const coins: any = await CacheHelper.get(CACHE_COINS_STATS_WEEK);
        if (coins) {
            return Promise.resolve(coins);
        }

        const end = moment();
        const start = moment().subtract("7", "days");

        return this.model.aggregate([
            {
                $project: {
                    avgPrice: {
                        $avg: "$history.usd"
                    },
                    coinId: "$coinId",
                    created_on: "$created_on"
                }
            },
            { $match: { created_on: { $gt: start.toDate(), $lt: end.toDate() } } },
            { $group: {
                 _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$created_on" }}, coinId: "$coinId"},
                 count: { $sum: 1 },
                 avgPrice: { $max: "$avgPrice" }
            } },

        ]).then((results: any) => {
            // map on identifier
            const map: any = {};
            for (const result of results) {
                if (!map[result._id.coinId]) {
                    map[result._id.coinId] = {};
                }
                map[result._id.coinId][result._id.date] = { ...result, _id: undefined};
            }
            CacheHelper.cache(CACHE_COINS_STATS_WEEK, map, CacheHelper.HOUR);

            return map;
        });
    }

    public async sparklineWeek(ids: string[]): Promise<any> {

        const end = moment();
        const start = moment().subtract("20", "days");

        const coins: any = await CoinModel.find({created_on: {$gte: start.toDate(), $lt: end}})
            .sort({ _id: -1 });

        const history: any = {};
        for (const coin of coins) {

            const date = moment(coin.created_on);
            if (!history[date.format("YYYY-MM-DD")]) {
                history[date.format("YYYY-MM-DD")] = [coin];
            } else {
                history[date.format("YYYY-MM-DD")].push(coin);
            }
        }

        // const records = await CoinCollectionModel.find({
        //     created_on: { $gt: start.toDate(), $lt: end.toDate() }
        // });

        // console.log(records);
        return null;
        // return CoinModel.find({
        //     "coins.id": { $in: ids }
        // })
        //     .limit(100)
        //     .then((details: any) => {
        //         console.log(details.length);
        //         return null;
        //     });
        // return null;
        // return CoinModel.aggregate([
        //     { $match: {} },
        //     { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
        //     { $sort: { _id: 1 } }
        // ]).then((doc: any) => {
        //     return null;
        // });
        // return CoinModel.aggregate([
        //     { $match: { "coins.id": { $in: ids } } },
        //     // Unwind the array to denormalize
        //     { $unwind: "$coins" },
        //     // Match specific array elements
        //     { $match: { "coins.id": { $in: ids } } },
        //     // Group back to array form
        //     {
        //         $group: {
        //             _id: "$_id",
        //             coins: { $push: "$coins" }
        //         }
        //     },
        //     { $sort: { _id: -1 } },
        //     { $limit: 7 }
        // ]).then((results: any) => {
        //     return results;
        // });
    }
}

export default new CoinRepository();

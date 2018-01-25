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
export const CACHE_COINS_TODAY: string = "coins/today";
export const cacheKeyCoin = (coinId: string) => `coin/identifier/${coinId}`;
export const CACHE_SYMBOL_TO_IDENTIFIER = "coins/symbol_to_identifier";

class CoinRepository extends MongoRepository<Coin> {
    constructor() {
        super(CoinModel, "Coin");
    }

    public async findWithHistory(coinIds: string[]): Promise<any> {

        const coinsMap: any = {};
        for (const coinId of coinIds) {
            const coin = await this.findCoinToday(coinId);
            coinsMap[coinId] = coin;
        }

        return Promise.resolve(coinsMap);
    }

    public async findCoinToday(coinId: string) {
        const cachedCoin = await CacheHelper.get(cacheKeyCoin(coinId));
        if (cachedCoin) {
            return Promise.resolve(cachedCoin);
        }

        // find coin and cache
        const start = moment().startOf("day");
        const end = moment().endOf("day");
        const dao = await this.model
            .findOne({ coinId, created_on: { $gte: start, $lt: end }}, {history: { $slice: -3 }}).lean();

        const obj = this.parse(dao);
        CacheHelper.cache(cacheKeyCoin(coinId), obj, CacheHelper.MIN * 5);
        return Promise.resolve(obj);
    }

    public async findCoinTodayBySymbol(symbol: string) {
        const idMap = await this.symbolToIdentifier([symbol]);
        return await this.findCoinToday(idMap[symbol]);
    }

    public async symbolToIdentifier(symbols: string[]): Promise<any> {
        const cacheEntry = await CacheHelper.get(CACHE_SYMBOL_TO_IDENTIFIER);
        if (cacheEntry) {
            return Promise.resolve(cacheEntry);
        }

        const coins = await this.findAllToday();
        const coinMap: any = {};
        for (const coin of coins) {
            coinMap[coin.symbol] = coin.coinId;
        }

        CacheHelper.cache(CACHE_SYMBOL_TO_IDENTIFIER, coinMap, CacheHelper.HOUR);

        return coinMap;
    }

    public async findAllToday(): Promise<any[]> {

        const coinsToday: any = await CacheHelper.get(CACHE_COINS_TODAY);
        if (coinsToday) {
            return Promise.resolve(coinsToday);
        }

        const start = moment().startOf("day");
        const end = moment().endOf("day");
        const self = this;
        const daos = await this.model
            .find({ created_on: { $gte: start, $lt: end }})
            .select("coinId _id name symbol");
        // const objs = daos.map((dao: any) => self.parse(dao));
        CacheHelper.cache(CACHE_COINS_TODAY, daos, CacheHelper.MIN * 2);

        return Promise.resolve(daos);
    }

    public async findDistinctMappedBySymbol(coinIds: string[]): Promise<any> {
        const map = await this.findWithHistory(coinIds);
        const newMap: any = {};
        Object.keys(map).forEach((key: string) => {
            const coin: any = map[key];
            newMap[coin.symbol] = coin;
        });

        return newMap;
    }

    public async findDistinctMappedByIdentifier(coinIds: string[]): Promise<any> {
        const map = await this.findWithHistory(coinIds);
        const newMap: any = {};
        Object.keys(map).forEach((key: string) => {
            const coin: any = map[key];
            newMap[coin.coinId] = coin;
        });

        return newMap;
    }

    public async existingCoinToday(): Promise<any[]> {
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

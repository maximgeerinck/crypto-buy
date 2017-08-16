import * as bluebird from "bluebird";
import * as flatten from "flat";
import * as redis from "redis";
import mongoose from "../db";
import CoinModel, { Coin } from "../models/Coin";
import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
import { IRepositoryAdapter, MongoRepository } from "./repository";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient({ host: "redis", port: 6379 }) as any;

interface ICoinStatistic {
    [key: string]: {
        [date: string]: number;
    };
}

interface ICoinRepository {
    findCoinsByIds(ids: string[]): Promise<Coin[]>;
    sparklineWeek(ids: string[]): Promise<ICoinStatistic>;
}

class CoinRepository extends MongoRepository<Coin> implements ICoinRepository {
    constructor() {
        super(CoinModel, "Coin");
    }

    public findCoinsByIds(ids: string[]): Promise<Coin[]> {
        return CoinModel.findOne({})
            .select("coins.id coins.name coins.symbol coins.rank coins._id coins.change coins.price.usd")
            .sort({ _id: -1 })
            .limit(1)
            .then((details: any) => {
                const result: any = [];
                for (const detail of details.coins) {
                    if (ids.indexOf(detail.id) >= 0) {
                        result.push(detail);
                    }
                }

                return result.map(Coin.parse);

                // return client
                //     .getAsync("COINS")
                //     .then((result: any) => {
                //         if (!result) {
                //             client.set("COINS", JSON.stringify(result.map(Coin.parse)));
                //             return result.map(Coin.parse);
                //         }

                //         return JSON.parse(result).map(Coin.parse);
                //         // return JSON.parse(client.get("COINS"));
                //     })
                //     .catch((err: any) => {
                //         console.log(err);
                //         // console.log(JSON.stringify(details.coins));
                //         client.set("COINS", JSON.stringify(result.map(Coin.parse)));
                //     });
            });
    }

    public sparklineWeek(ids: string[]): Promise<ICoinStatistic> {
        return CoinModel.aggregate([
            { $match: { "coins.id": { $in: ids } } },
            // Unwind the array to denormalize
            { $unwind: "$coins" },
            // Match specific array elements
            { $match: { "coins.id": { $in: ids } } },

            // Group back to array form
            {
                $group: {
                    _id: "$_id",
                    coins: { $push: "$coins" }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 7 }
        ]).then((results: any) => {
            return results;
        });
    }
}

export default new CoinRepository();

// import * as bluebird from "bluebird";
// import * as flatten from "flat";
// import * as moment from "moment";
// import * as redis from "redis";
// import mongoose from "../db";
// import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
// import { IRepositoryAdapter, MongoRepository } from "../services/repository";
// import { Coin } from "./Coin";
// import CoinCollectionModel, { CoinCollection } from "./CoinCollection";

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);
// const client = redis.createClient({ host: "redis", port: 6379 }) as any;

// interface ICoinStatistic {
//     [key: string]: {
//         [date: string]: number;
//     };
// }

// interface ICoinRepository {
//     findCoinsByIds(ids: string[]): Promise<Coin[]>;
//     sparklineWeek(ids: string[]): Promise<ICoinStatistic>;
// }

// class CoinRepository extends MongoRepository<CoinCollection> {
//     constructor() {
//         super(CoinCollectionModel, "CoinCollection");
//     }

//     public findAllWithHistory(): Promise<any> {
//         const key = "COINS";

//         return new Promise((resolve) => {
//             client.get(key, (error: any, result: any) => {
//                 if (result) {
//                     return resolve(JSON.parse(result));
//                 } else {
//                     return CoinCollectionModel.find({})
//                         .lean() // make sure we work with JS objects
//                         .select(
//                         "coins.coinId coins.name coins.symbol coins.rank coins._id coins.change coins.price.usd"
//                         )
//                         .sort({ _id: -1 })
//                         .limit(5)
//                         .then((records: any) => {
//                             // coins
//                             const coins: any = {};
//                             for (const collection of records) {
//                                 for (const coin of collection.coins) {
//                                     if (!coins[coin.coinId]) {
//                                         coins[coin.coinId] = Object.assign({ history: [] }, coin);
//                                     } else {
//                                         coins[coin.coinId].history.push({
//                                             date: collection.created_on,
//                                             price: coin.price.usd
//                                         });
//                                     }
//                                 }
//                             }

//                             client.setex("COINS", 60, JSON.stringify(coins));

//                             return resolve(coins);
//                         });
//                 }
//             });
//         });
//     }

//     public async findDistinctMappedBySymbol(): Promise<any> {
//         const map = await this.findAllWithHistory();
//         const newMap: any = {};
//         Object.keys(map).forEach((key: string) => {
//             const coin: any = map[key];
//             newMap[coin.symbol] = coin;
//         });

//         return newMap;
//     }

//     public async sparklineWeek(ids: string[]): Promise<any> {

//         const end = moment();
//         const start = moment().subtract("20", "days");

//         console.log(`${start} - ${end}`);

//         const count = await CoinCollectionModel.count({});

//         const coins: any = await CoinCollectionModel.find({created_on: {$gte: start.toDate(), $lt: end}})
//             .select("created_on, coins.coinId coins.name coins.symbol coins.rank coins.change coins.price.usd")
//             .sort({ _id: -1 });

//         const history: any = {};
//         for (const coin of coins) {

//             const date = moment(coin.created_on);
//             if (!history[date.format("YYYY-MM-DD")]) {
//                 history[date.format("YYYY-MM-DD")] = [coin];
//             } else {
//                 history[date.format("YYYY-MM-DD")].push(coin);
//             }
//         }

//         console.log(Object.keys(history).length);

//         // const records = await CoinCollectionModel.find({
//         //     created_on: { $gt: start.toDate(), $lt: end.toDate() }
//         // });

//         // console.log(records);
//         return null;
//         // return CoinModel.find({
//         //     "coins.id": { $in: ids }
//         // })
//         //     .limit(100)
//         //     .then((details: any) => {
//         //         console.log(details.length);
//         //         return null;
//         //     });
//         // return null;
//         // return CoinModel.aggregate([
//         //     { $match: {} },
//         //     { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
//         //     { $sort: { _id: 1 } }
//         // ]).then((doc: any) => {
//         //     return null;
//         // });
//         // return CoinModel.aggregate([
//         //     { $match: { "coins.id": { $in: ids } } },
//         //     // Unwind the array to denormalize
//         //     { $unwind: "$coins" },
//         //     // Match specific array elements
//         //     { $match: { "coins.id": { $in: ids } } },
//         //     // Group back to array form
//         //     {
//         //         $group: {
//         //             _id: "$_id",
//         //             coins: { $push: "$coins" }
//         //         }
//         //     },
//         //     { $sort: { _id: -1 } },
//         //     { $limit: 7 }
//         // ]).then((results: any) => {
//         //     return results;
//         // });
//     }
// }

// export default new CoinRepository();

// import { Document, Schema } from "mongoose";
// import mongoose from "../db";
// import AbstractModel from "../models/AbstractModel";
// import { Coin, ICoin, ICoinDAO } from "./Coin";

// interface ICoinCollection {
//     createdOn: Date;
//     updatedOn: Date;
//     coins: ICoin[];
// }

// interface ICoinCollectionDAO {
//     created_on: Date;
//     updated_on: Date;
//     coins: ICoinDAO[];
// }

// export class CoinCollection extends AbstractModel implements ICoinCollection {
//     public static parse(coinCollectionDao: ICoinCollectionDAO) {
//         const coins = coinCollectionDao.coins.map(Coin.parse);
//         return new CoinCollection(coins, coinCollectionDao.created_on, coinCollectionDao.updated_on);
//     }

//     constructor(readonly coins: Coin[], readonly createdOn = new Date(), readonly updatedOn = new Date()) {
//         super();
//     }

//     public add(coin: Coin) {
//         this.coins.push(coin);
//     }

//     public toDAO() {
//         return {
//             created_on: this.createdOn,
//             updated_on: this.updatedOn,
//             coins: this.coins.map((coin: Coin) => coin.toDAO())
//         };
//     }
// }

// export default CoinCollection;

// // export const CoinSchema = new Schema(
// //     {
// //         coins: [
// //             {
// //                 coinId: { type: String },
// //                 name: { type: String },
// //                 symbol: { type: String },
// //                 rank: { type: Number },
// //                 price: {
// //                     usd: { type: Number },
// //                     btc: { type: Number }
// //                 },
// //                 market_cap: { type: Number },
// //                 supply: {
// //                     available: { type: Number },
// //                     total: { type: Number }
// //                 },
// //                 volume: { type: Number },
// //                 change: {
// //                     percent_1h: { type: Number },
// //                     percent_24h: { type: Number },
// //                     percent_7d: { type: Number }
// //                 },
// //                 timestamp: { type: Number },
// //                 history: [{
// //                     btc: { type: Number },
// //                     usd: { type: Number }
// //                 }]
// //             }
// //         ]
// //     },
// //     { timestamps: { createdAt: "created_on", updatedAt: "updated_on" }, strict: false }
// // );

// // export default mongoose.model("Coin", CoinSchema);

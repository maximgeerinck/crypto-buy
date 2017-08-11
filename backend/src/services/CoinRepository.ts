import mongoose from "../db";
import CoinModel, { Coin } from "../models/Coin";
import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
import { IRepositoryAdapter, MongoRepository } from "./repository";

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

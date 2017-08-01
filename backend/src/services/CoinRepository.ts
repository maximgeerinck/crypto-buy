import mongoose from "../db";
import CoinModel, { Coin } from "../models/Coin";
import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
import { IRepositoryAdapter, MongoRepository } from "./repository";

interface ICoinRepository {
    findCoinsBySymbols(symbol: string[]): Promise<Coin[]>;
}

class CoinRepository extends MongoRepository<Coin> implements ICoinRepository {
    constructor() {
        super(CoinModel, "Coin");
    }

    public findCoinsBySymbols(symbols: string[]): Promise<Coin[]> {
        return CoinModel.findOne({})
            .select("coins.id coins.name coins.symbol coins.rank coins._id coins.change coins.price.usd")
            .sort({ _id: -1 })
            .limit(1)
            .then((details: any) => {
                const result: any = [];
                for (const detail of details.coins) {
                    if (symbols.indexOf(detail.symbol) >= 0) {
                        result.push(detail);
                    }
                }

                return result.map(Coin.parse);
            });
    }
}

export default new CoinRepository();

import { Document, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "../models/AbstractModel";

export interface IMarketCoins {
    [coin: string]: string[];
}

interface IMarketCoinDAO {
    from: string;
    to: string[];
}

export interface IMarket {
    name: string;
    coins: IMarketCoins;
}

export interface IMarketDAO {
    name: string;
    coins: IMarketCoinDAO[];
}

export class Market extends AbstractModel implements IMarket {

    public static parse(dao: IMarketDAO): Market {

        const coins: IMarketCoins = {};
        for (const coin of dao.coins) {
            coins[coin.from] = coin.to;
        }

        const obj = new Market(dao.name, coins);
        return obj;
    }

    public coins: IMarketCoins;

    constructor(
        readonly name: string,
        coins: IMarketCoins = null) {
        super();
        this.coins = coins;
    }

    public toDAO() {

        const coinDAO: IMarketCoinDAO[] = Object.keys(this.coins).map((coinName: string) => {
            return {
                from: coinName,
                to : this.coins[coinName]
            } as IMarketCoinDAO;
        });

        return {
            name: this.name,
            coins: coinDAO
        } as IMarketDAO;
    }
}

export const MarketSchema = new Schema({
    name: { type: String, required: true },
    coins: [{
        from: { type: String, required: true },
        to: [{ type: String }]
    }]
});

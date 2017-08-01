import { Document, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "./AbstractModel";

export interface IPrice {
    usd: number;
    btc: number;
}

export interface IMarketCap {
    usd: number;
}

export interface ISupply {
    available: number;
    total: number;
}

export interface IChange {
    percentHour: number;
    percentDay: number;
    percentWeek: number;
}

export interface IChangeDAO {
    percent_1h: number;
    percent_24h: number;
    percent_7d: number;
}

export interface ICoin {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    price: IPrice;
    marketCap: IMarketCap;
    supply: ISupply;
    change: IChange;
    timestamp: number;
}

export interface ICoinDAO {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    price: IPrice;
    marketCap: IMarketCap;
    supply: ISupply;
    change: IChangeDAO;
    timestamp: number;
}

export class Coin extends AbstractModel implements ICoin {
    public static parse(coinDAO: ICoinDAO) {
        const coin: Coin = new Coin(coinDAO.id, coinDAO.name, coinDAO.symbol);
        coin.rank = coinDAO.rank;
        coin.price = coinDAO.price;
        coin.marketCap = coinDAO.marketCap;
        coin.supply = coinDAO.supply;
        coin.change = {
            percentHour: coinDAO.change.percent_1h,
            percentDay: coinDAO.change.percent_24h,
            percentWeek: coinDAO.change.percent_7d
        };
        coin.timestamp = coinDAO.timestamp;
        return coin;
    }

    public rank: number;
    public price: IPrice;
    public marketCap: IMarketCap;
    public supply: ISupply;
    public change: IChange;
    public timestamp: number;

    constructor(readonly id: string, readonly name: string, readonly symbol: string) {
        super();
    }

    public toDAO() {
        return {
            id: this.id,
            name: this.name,
            symbol: this.symbol,
            rank: this.rank,
            price: this.price,
            marketCap: this.marketCap,
            supply: this.supply,
            change: {
                percent_1h: this.change.percentHour,
                percent_24h: this.change.percentDay,
                percent_7d: this.change.percentWeek
            },
            timestamp: this.timestamp
        } as ICoinDAO;
    }
}

export const CoinSchema = new Schema(
    {
        coins: [
            new Schema(
                {
                    id: { type: String },
                    name: { type: String },
                    symbol: { type: String },
                    rank: { type: Number },
                    price: {
                        usd: { type: Number },
                        btc: { type: Number }
                    },
                    market_cap: {
                        usd: { type: Number }
                    },
                    supply: {
                        available: { type: Number },
                        total: { type: Number }
                    },
                    change: {
                        percent_1h: { type: Number },
                        percent_24h: { type: Number },
                        percent_7d: { type: Number }
                    },
                    timestamp: { type: Number }
                },
                { strict: false }
            )
        ]
    },
    { timestamps: { createdAt: "created_on", updatedAt: "updated_on" }, strict: false }
);

export default mongoose.model("Coin", CoinSchema);

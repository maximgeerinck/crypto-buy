import { Document, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "../models/NewAbstractModel";

export interface ISupply {
    available: number;
    total: number;
}

export interface IChange {
    percentHour?: number;
    percentDay?: number;
    percentWeek?: number;
}

export interface IChangeDAO {
    percent_1h: number;
    percent_24h: number;
    percent_7d: number;
}
export interface IHistoryEntry {
    btc?: number;
    usd: number;
    timestamp: Date;
    change: IChange;
}

export interface ICoin {
    id: any;
    coinId: string;
    image?: string;
    name: string;
    symbol: string;
    rank: number;
    marketCap: number;
    supply: ISupply;
    volume: number;
    history: IHistoryEntry[];
}

export interface ICoinDAO extends ICoin, mongoose.Document {
    _id: any;
    id: null;
}

export class Coin extends AbstractModel implements ICoin {
    public static parse(coinDAO: ICoinDAO) {
        if (!coinDAO) {
            return;
        }
        const coin: Coin = new Coin(coinDAO.coinId, coinDAO.name, coinDAO.symbol, coinDAO._id);
        coin.rank = coinDAO.rank;
        coin.marketCap = coinDAO.marketCap;
        coin.supply = coinDAO.supply;
        coin.history = coinDAO.history;
        if (coinDAO.image) {
            coin.image = coinDAO.image;
        }
        return coin;
    }

    public volume: number;
    public rank: number;
    public marketCap: number;
    public supply: ISupply;
    public change: IChange;
    public timestamp: number;
    public history: IHistoryEntry[];
    public image: string;

    constructor(
        readonly coinId: string,
        readonly name: string,
        readonly symbol: string,
        readonly id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(),
    ) {
        super();
    }
}

export const CoinSchema = new Schema(
    {
        coinId: { type: String },
        name: { type: String },
        symbol: { type: String },
        rank: { type: Number },
        price: {
            usd: { type: Number },
            btc: { type: Number },
        },
        image: { type: String },
        marketCap: { type: Number },
        supply: {
            available: { type: Number },
            total: { type: Number },
        },
        volume: { type: Number },
        history: [
            {
                timestamp: { type: Date, default: Date.now },
                btc: { type: Number },
                usd: { type: Number },
                change: {
                    percentHour: { type: Number },
                    percentDay: { type: Number },
                    percentWeek: { type: Number },
                },
                _id: { id: false },
            },
        ],
    },
    { timestamps: { createdAt: "created_on", updatedAt: "updated_on" }, strict: false },
);

CoinSchema.index({ created_on: 1 });
export default mongoose.model("Coin", CoinSchema);

import { Document, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "../models/AbstractModel";

export interface IPrice {
    usd: number;
    btc: number;
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
    id: any;
    coinId: string;
    name: string;
    symbol: string;
    rank: number;
    price: IPrice;
    marketCap: number;
    supply: ISupply;
    change: IChange;
    volume: number;
    timestamp: number;
}

export interface ICoinDAO {
    _id: any;
    coin_id: string;
    name: string;
    symbol: string;
    rank: number;
    price: IPrice;
    market_cap: number;
    supply: ISupply;
    change: IChangeDAO;
    volume: number;
    timestamp: number;
}

export class Coin extends AbstractModel implements ICoin {
    public static parse(coinDAO: ICoinDAO) {
        const coin: Coin = new Coin(coinDAO.coin_id, coinDAO.name, coinDAO.symbol);
        coin.rank = coinDAO.rank;
        coin.price = coinDAO.price;
        coin.marketCap = coinDAO.market_cap;
        coin.supply = coinDAO.supply;
        coin.change = {
            percentHour: coinDAO.change.percent_1h,
            percentDay: coinDAO.change.percent_24h,
            percentWeek: coinDAO.change.percent_7d
        };
        coin.timestamp = coinDAO.timestamp;
        return coin;
    }

    public volume: number;
    public rank: number;
    public price: IPrice;
    public marketCap: number;
    public supply: ISupply;
    public change: IChange;
    public timestamp: number;

    constructor(
        readonly coinId: string,
        readonly name: string,
        readonly symbol: string,
        readonly id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
    ) {
        super();
    }

    public toDAO() {
        return {
            _id: this.id,
            coin_id: this.coinId,
            name: this.name,
            symbol: this.symbol,
            rank: this.rank,
            price: this.price,
            market_cap: this.marketCap,
            supply: this.supply,
            volume: this.volume,
            change: {
                percent_1h: this.change.percentHour,
                percent_24h: this.change.percentDay,
                percent_7d: this.change.percentWeek
            },
            timestamp: this.timestamp
        } as ICoinDAO;
    }
}

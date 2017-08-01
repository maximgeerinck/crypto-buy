import mongoose from "../db";
import AbstractModel from "./AbstractModel";

export interface IUserCoin {
    _id: any;
    symbol: string;
    amount: number;
    source: string;
    boughtPrice: number;
    boughtAt?: Date;
}
export interface IUserCoinDAO {
    _id: any;
    symbol: string;
    amount: number;
    source: string;
    bought_price: number;
    bought_at?: Date;
}
export default class UserCoin extends AbstractModel implements IUserCoin {
    public static parse(userCoin: IUserCoinDAO): UserCoin {
        const userCoinObj = new UserCoin(
            userCoin.symbol,
            userCoin.amount,
            userCoin.source,
            userCoin.bought_price,
            userCoin.bought_at,
            userCoin._id
        );
        return userCoinObj;
    }

    public static parseDomain(userCoin: IUserCoin): UserCoin {
        const userCoinObj: UserCoin = new UserCoin(
            userCoin.symbol,
            userCoin.amount,
            userCoin.source,
            userCoin.boughtPrice,
            userCoin.boughtAt,
            userCoin._id
        );
        return userCoinObj;
    }

    public symbol: string;
    public amount: number;
    public source: string;
    public boughtPrice: number;
    public boughtAt: Date = null;

    constructor(
        symbol: string,
        amount: number,
        source: string,
        boughtPrice: number,
        boughtAt: Date = null,
        readonly _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
    ) {
        super();
        this.symbol = symbol;
        this.amount = amount;
        this.source = source;
        this.boughtPrice = boughtPrice;
        this.boughtAt = boughtAt;
    }

    toDAO() {
        const userCoinDAO: IUserCoinDAO = {
            _id: this._id,
            symbol: this.symbol,
            amount: this.amount,
            source: this.source,
            bought_price: this.boughtPrice
        };

        if (this.boughtAt) userCoinDAO.bought_at = this.boughtAt;

        return userCoinDAO;
    }
}

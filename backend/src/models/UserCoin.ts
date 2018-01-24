import mongoose from "../db";
import AbstractModel from "./AbstractModel";

export interface IUserCoin {
    id: any;
    coinId: string;
    amount: number;
    source: string;
    boughtPrice: number; // per coin
    currency: string;
    boughtAt?: Date;
    automatic?: boolean;
}
export interface IUserCoinDAO {
    _id: any;
    coin_id: string;
    amount: number;
    source: string;
    bought_price: number; // per coin
    currency: string;
    bought_at?: Date;
}
export default class UserCoin extends AbstractModel implements IUserCoin {
    public static parse(userCoin: IUserCoinDAO): UserCoin {
        const userCoinObj = new UserCoin(
            userCoin.coin_id,
            userCoin.amount,
            userCoin.source,
            userCoin.bought_price,
            userCoin.currency,
            userCoin.bought_at,
            false,
            userCoin._id
        );
        return userCoinObj;
    }

    public static parseDomain(userCoin: IUserCoin): UserCoin {
        const userCoinObj: UserCoin = new UserCoin(
            userCoin.coinId,
            userCoin.amount,
            userCoin.source,
            userCoin.boughtPrice,
            userCoin.currency,
            userCoin.boughtAt,
            userCoin.automatic || false,
            userCoin.id
        );
        return userCoinObj;
    }

    public coinId: string;
    public amount: number;
    public source: string;
    public currency: string;
    public boughtPrice: number;
    public boughtAt: Date = null;

    constructor(
        coinId: string,
        amount: number,
        source: string,
        boughtPrice: number,
        currency: string,
        boughtAt: Date = null,
        readonly automatic: boolean = false,
        readonly id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
    ) {
        super();
        this.coinId = coinId;
        this.amount = amount;
        this.source = source;
        this.currency = currency;
        this.boughtPrice = boughtPrice;
        this.boughtAt = boughtAt;
    }

    public toDAO() {
        const userCoinDAO: IUserCoinDAO = {
            _id: this.id,
            coin_id: this.coinId,
            amount: this.amount,
            source: this.source,
            currency: this.currency,
            bought_price: this.boughtPrice
        };

        if (this.boughtAt) {
            userCoinDAO.bought_at = this.boughtAt;
        }

        return userCoinDAO;
    }
}

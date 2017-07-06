import mongoose from '../db';
import AbstractModel from './AbstractModel';

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
  symbol: string;
  amount: number;
  source: string;
  boughtPrice: number;
  boughtAt: Date = null;

  constructor(
    symbol: string,
    amount: number,
    source: string,
    boughtPrice: number,
    boughtAt: Date = null,
    readonly _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId() // readonly boughtPrice: Number, // readonly totalPrice: Date
  ) {
    super();
    this.symbol = symbol;
    this.amount = amount;
    this.source = source;
    this.boughtPrice = boughtPrice;
    this.boughtAt = boughtAt;
  }

  static parse(userCoin: IUserCoinDAO): UserCoin {
    let userCoinObj = new UserCoin(
      userCoin.symbol,
      userCoin.amount,
      userCoin.source,
      userCoin.bought_price,
      userCoin.bought_at,
      userCoin._id
    );
    return userCoinObj;
  }

  static parseDomain(userCoin: IUserCoin): UserCoin {
    let userCoinObj: UserCoin = new UserCoin(
      userCoin.symbol,
      userCoin.amount,
      userCoin.source,
      userCoin.boughtPrice,
      userCoin.boughtAt,
      userCoin._id
    );
    return userCoinObj;
  }

  toDAO() {
    let userCoinDAO: IUserCoinDAO = {
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

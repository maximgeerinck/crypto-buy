import mongoose from '../db';
import { Schema, Model, Document } from 'mongoose';
import AbstractModel from './AbstractModel';
import { genSalt, hashPassword } from '../utils/cypher-util';

export interface IUserCredential {
  password: string;
  salt: string;
  requestedOn: Date;
  expired: boolean;
  expiredOn?: Date;
}

export interface IUserCredentialDAO {
  password: string;
  salt: string;
  requested_on: Date;
  expired: boolean;
  expired_on?: Date;
}

export interface IUserCurrency {
  currency: string;
  amount: number;
  source: string;
  // totalPrice: Date;
  // boughtPrice: Number;
}
export interface IUserCurrencyDAO {
  currency: string;
  amount: number;
  source: string;
  // total_price: Date;
  // bought_price: Number;
}

export interface IUser {
  _id: any;
  email: string;
  enabled: boolean;
  expired: boolean;
  credentials?: Array<IUserCredential>;
  portfolio: Array<IUserCurrency>;
  activatedOn?: Date;
  createdOn: Date;
  updatedOn: Date;
  token: string;
}
export interface IUserDAO extends Document {
  _id: any;
  email: string;
  enabled: boolean;
  expired: boolean;
  credentials?: Array<IUserCredentialDAO>;
  portfolio: Array<IUserCurrencyDAO>;
  activated_on: Date;
  created_on: Date;
  updated_on: Date;
  token: string;
}

export class UserCredential extends AbstractModel implements IUserCredential {
  requestedOn: Date = new Date();
  expiredOn?: Date;
  password: string;
  salt: string;

  constructor(password: string, salt: string, readonly expired: boolean = false) {
    super();
    this.password = password;
    this.salt = salt;
  }

  static parse(credential: IUserCredentialDAO): UserCredential {
    let credentialObj = new UserCredential(credential.password, credential.salt, credential.expired);
    credentialObj.requestedOn = credential.requested_on;
    credentialObj.expiredOn = credential.expired_on;
    return credentialObj;
  }

  static parseDomain(credential: IUserCredential): UserCredential {
    let credentialObj = new UserCredential(credential.password, credential.salt, credential.expired);
    credentialObj.requestedOn = credential.requestedOn;
    credentialObj.expiredOn = credential.expiredOn;
    return credentialObj;
  }

  toDAO() {
    let credentialDAO = {
      password: this.password,
      salt: this.salt,
      expired: this.expired,
      expired_on: this.expiredOn,
      requested_on: this.requestedOn
    };

    if (this.expiredOn) credentialDAO.expired_on = this.expiredOn;

    return credentialDAO;
  }
}
export class UserCurrency extends AbstractModel implements IUserCurrency {
  constructor(
    readonly currency: string,
    readonly amount: number,
    readonly source: string // readonly boughtPrice: Number, // readonly totalPrice: Date
  ) {
    super();
  }

  static parse(userCurrency: IUserCurrencyDAO): UserCurrency {
    let userCurrencyObj = new UserCurrency(
      userCurrency.currency,
      userCurrency.amount,
      userCurrency.source
      // userCurrency.bought_price,
      // userCurrency.total_price
    );
    return userCurrencyObj;
  }

  static parseDomain(userCurrency: IUserCurrency): UserCurrency {
    let userCurrencyObj: UserCurrency = new UserCurrency(
      userCurrency.currency,
      userCurrency.amount,
      userCurrency.source
      // userCurrency.boughtPrice,
      // userCurrency.totalPrice
    );
    return userCurrencyObj;
  }

  toDAO() {
    let userCurrencyDAO = {
      currency: this.currency,
      amount: this.amount,
      source: this.source
      // bought_price: this.boughtPrice,
      // total_price: this.totalPrice,
    };
    return userCurrencyDAO;
  }
}

export class User extends AbstractModel implements IUser {
  enabled: boolean = true;
  expired: boolean = false;
  updatedOn: Date = new Date();
  activatedOn: Date;
  token: string = null;

  constructor(
    readonly email: string,
    readonly credentials: Array<UserCredential>,
    readonly portfolio: Array<UserCurrency>,
    readonly createdOn: Date = new Date(),
    readonly _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
  ) {
    super();
  }

  static parse(user: IUserDAO): User {
    let credentials = user.credentials ? user.credentials.map(credential => UserCredential.parse(credential)) : null;
    let portfolio = user.portfolio ? user.portfolio.map(currency => UserCurrency.parse(currency)) : null;

    let userObj = new User(user.email, credentials, portfolio, user.created_on, user._id);
    userObj.token = user.token;
    userObj.updatedOn = user.updated_on;
    return userObj;
  }

  addCredentials(credentials: UserCredential) {
    this.credentials.push(credentials);
  }

  static parseDomain(user: IUser): User {
    let credentials = user.credentials
      ? user.credentials.map(credential => UserCredential.parseDomain(credential))
      : null;

    let portfolio = user.portfolio ? user.portfolio.map(currency => UserCurrency.parseDomain(currency)) : null;

    let userObj = new User(user.email, credentials, portfolio, user.createdOn, user._id);
    userObj.token = user.token;
    userObj.updatedOn = user.updatedOn;
    return userObj;
  }

  toDAO() {
    let credentials: Array<IUserCredentialDAO>;
    if (this.credentials) {
      credentials = this.credentials.map(credential => credential.toDAO());
    }

    let portfolio: Array<IUserCurrencyDAO>;
    if (this.portfolio) {
      portfolio = this.portfolio.map(item => item.toDAO());
    }

    return {
      token: this.token,
      email: this.email,
      enabled: this.enabled,
      expired: this.expired,
      credentials: credentials,
      activated_on: this.activatedOn,
      created_on: this.createdOn,
      updated_on: this.updatedOn,
      portfolio: portfolio
    };
  }
}

export interface IUserModel extends IUserDAO {}

export const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true
    },
    enabled: { type: Boolean, required: true, default: true },
    expired: { type: Boolean, required: true, default: false },
    credentials: [
      {
        password: { type: String, required: true },
        salt: { type: String, required: true },
        requestedOn: { type: Date, required: true, default: Date.now },
        expired: { type: Boolean, required: true, default: false },
        expiredOn: { type: Date, required: false }
      }
    ],
    portfolio: [
      {
        currency: { type: String, required: true },
        amount: { type: Number, required: true, default: 0.0 },
        source: { type: String, required: true }
        // total_price: { type: Date, required: true, default: Date.now },
        // bought_price: { type: Number, required: true, default: 0.0 }
      }
    ],
    activated_on: { type: String },
    token: { type: String, required: false }
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } }
);

export default mongoose.model<IUserModel>('User', UserSchema, 'users');

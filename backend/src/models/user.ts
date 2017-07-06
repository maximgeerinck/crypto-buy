import mongoose from '../db';
import { Schema, Model, Document } from 'mongoose';
import AbstractModel from './AbstractModel';
import { genSalt, hashPassword } from '../utils/cypher-util';
import UserCredential, { IUserCredential, IUserCredentialDAO } from './UserCredential';
import UserCoin, { IUserCoin, IUserCoinDAO } from './UserCoin';
import UserPreferences, { IUserPreferences, IUserPreferencesDAO } from './UserPreferences';

export interface IUser {
  _id: any;
  email: string;
  enabled: boolean;
  expired: boolean;
  credentials?: Array<IUserCredential>;
  portfolio: Array<IUserCoin>;
  activatedOn?: Date;
  createdOn: Date;
  updatedOn: Date;
  token: string;
  preferences: IUserPreferences;
}
export interface IUserDAO extends Document {
  _id: any;
  email: string;
  enabled: boolean;
  expired: boolean;
  credentials?: Array<IUserCredentialDAO>;
  portfolio: Array<IUserCoinDAO>;
  activated_on: Date;
  created_on: Date;
  updated_on: Date;
  token: string;
  preferences: IUserPreferencesDAO;
}

export class User extends AbstractModel implements IUser {
  enabled: boolean = true;
  expired: boolean = false;
  updatedOn: Date = new Date();
  activatedOn: Date;
  token: string = null;
  portfolio: Array<UserCoin> = [];
  preferences: UserPreferences = new UserPreferences('USD');
  credentials: Array<UserCredential> = [];

  constructor(
    readonly email: string,
    credentials: Array<UserCredential> = [],
    portfolio: Array<UserCoin> = [],
    readonly createdOn: Date = new Date(),
    readonly _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
  ) {
    super();
    this.portfolio = portfolio;
    this.credentials = credentials;
  }

  static parse(user: IUserDAO): User {
    let credentials = user.credentials ? user.credentials.map(credential => UserCredential.parse(credential)) : null;
    let portfolio = user.portfolio ? user.portfolio.map(Coin => UserCoin.parse(Coin)) : null;

    let userObj = new User(user.email, credentials, portfolio, user.created_on, user._id);
    userObj.token = user.token;
    userObj.updatedOn = user.updated_on;
    userObj.preferences = UserPreferences.parse(user.preferences);

    return userObj;
  }

  addCredentials(credentials: UserCredential) {
    this.credentials.push(credentials);
  }

  static parseDomain(user: IUser): User {
    let credentials = user.credentials
      ? user.credentials.map(credential => UserCredential.parseDomain(credential))
      : null;

    let portfolio = user.portfolio ? user.portfolio.map(Coin => UserCoin.parseDomain(Coin)) : null;

    let userObj = new User(user.email, credentials, portfolio, user.createdOn, user._id);
    userObj.token = user.token;
    userObj.updatedOn = user.updatedOn;
    userObj.preferences = UserPreferences.parseDomain(user.preferences);

    return userObj;
  }

  toDAO() {
    let credentials: Array<IUserCredentialDAO>;
    if (this.credentials) {
      credentials = this.credentials.map(credential => credential.toDAO());
    }

    let portfolio: Array<IUserCoinDAO>;
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
      portfolio: portfolio,
      preferences: this.preferences.toDAO()
    };
  }
}

export interface IUserModel extends IUserDAO { }

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
        symbol: { type: String, required: true },
        amount: { type: Number, required: true, default: 0.0 },
        source: { type: String, required: true },
        bought_price: { type: Number, required: false },
        bought_at: { type: Date, required: true, default: Date.now }
      }
    ],
    activated_on: { type: String },
    token: { type: String, required: false },
    preferences: {
      currency: { type: String, required: true, default: 'USD' },
      initial_investment: { type: Number, required: true, default: 0 }
    }
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } }
);

export default mongoose.model<IUserModel>('User', UserSchema, 'users');

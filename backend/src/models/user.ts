import { Document, Model, Schema } from "mongoose";
import mongoose from "../db";
import { genSalt, hashPassword } from "../utils/cypher-util";
import AbstractModel from "./AbstractModel";
import UserCoin, { IUserCoin, IUserCoinDAO } from "./UserCoin";
import UserCredential, { IUserCredential, IUserCredentialDAO } from "./UserCredential";
import UserPortfolioHistory, { IUserPortfolioHistoryItem, IUserPortfolioHistoryItemDAO } from "./UserPortfolioHistory";
import UserPreferences, { IUserPreferences, IUserPreferencesDAO } from "./UserPreferences";
import { IUserShareSettings, IUserShareSettingsDAO, UserShareSettings } from "./UserShareSettings";

export interface IUser {
    id: any;
    email: string;
    enabled: boolean;
    expired: boolean;
    credentials?: IUserCredential[];
    portfolio: IUserCoin[];
    activatedOn?: Date;
    createdOn: Date;
    updatedOn: Date;
    token: string;
    preferences: IUserPreferences;
    shares: IUserShareSettings[];
    history: UserPortfolioHistory;
}
export interface IUserDAO extends Document {
    _id: any;
    email: string;
    enabled: boolean;
    expired: boolean;
    credentials?: IUserCredentialDAO[];
    portfolio: IUserCoinDAO[];
    activated_on: Date;
    created_on: Date;
    updated_on: Date;
    token: string;
    preferences: IUserPreferencesDAO;
    shares?: IUserShareSettingsDAO[];
    history: IUserPortfolioHistoryItemDAO[];
}

export class User extends AbstractModel implements IUser {
    public static parse(user: IUserDAO): User {
        if (!user || typeof user !== "object") {
            throw new Error("MODEL_PARSE_EXCEPTION");
        }

        const credentials = user.credentials
            ? user.credentials.map((credential) => UserCredential.parse(credential))
            : null;

        const portfolio = user.portfolio ? user.portfolio.map((Coin) => UserCoin.parse(Coin)) : undefined;
        const shares = user.shares.map(
            (share: any) => (!mongoose.Types.ObjectId.isValid(share) ? UserShareSettings.parse(share) : undefined)
        );

        const userObj = new User(user.email, credentials, portfolio, user.created_on, user._id);
        userObj.shares = shares;
        userObj.token = user.token;
        userObj.updatedOn = user.updated_on;
        userObj.preferences = UserPreferences.parse(user.preferences);
        userObj.history = UserPortfolioHistory.parse(user.history);

        return userObj;
    }

    public static parseDomain(user: IUser): User {
        const credentials = user.credentials
            ? user.credentials.map((credential) => UserCredential.parseDomain(credential))
            : null;

        const portfolio = user.portfolio ? user.portfolio.map((Coin) => UserCoin.parseDomain(Coin)) : null;
        const shares = user.shares ? user.shares.map((share) => UserShareSettings.parseDomain(share)) : undefined;

        const userObj = new User(user.email, credentials, portfolio, user.createdOn, user.id);
        userObj.shares = shares;
        userObj.token = user.token;
        userObj.updatedOn = user.updatedOn;
        userObj.preferences = UserPreferences.parseDomain(user.preferences);
        userObj.history = user.history;

        return userObj;
    }

    public enabled: boolean = true;
    public expired: boolean = false;
    public updatedOn: Date = new Date();
    public activatedOn: Date;
    public token: string = null;
    public portfolio: UserCoin[] = [];
    public preferences: UserPreferences = new UserPreferences("USD");
    public credentials: UserCredential[] = [];
    public shares: UserShareSettings[] = [];
    public history: UserPortfolioHistory = new UserPortfolioHistory([]);

    constructor(
        readonly email: string,
        credentials: UserCredential[] = [],
        portfolio: UserCoin[] = [],
        readonly createdOn: Date = new Date(),
        readonly id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
    ) {
        super();
        this.portfolio = portfolio;
        this.credentials = credentials;
    }

    public addShare(share: UserShareSettings) {
        this.shares.push(share);
    }

    public addCredentials(credentials: UserCredential) {
        this.credentials.push(credentials);
    }

    public setShares(shares: UserShareSettings[]) {
        this.shares = shares;
    }

    public toDAO() {
        let credentials: IUserCredentialDAO[];
        if (this.credentials) {
            credentials = this.credentials.map((credential) => credential.toDAO());
        }

        let portfolio: IUserCoinDAO[];
        if (this.portfolio) {
            portfolio = this.portfolio.map((item) => item.toDAO());
        }

        return {
            token: this.token,
            email: this.email,
            enabled: this.enabled,
            expired: this.expired,
            history: this.history.toDAO(),
            credentials,
            activated_on: this.activatedOn,
            created_on: this.createdOn,
            updated_on: this.updatedOn,
            portfolio,
            shares: this.shares ? this.shares.map((share) => share.id) : [],
            preferences: this.preferences ? this.preferences.toDAO() : undefined
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
                coin_id: { type: String, required: true },
                amount: { type: Number, required: true, default: 0.0 },
                source: { type: String, required: true },
                bought_price: { type: Number, required: false },
                currency: { type: String, required: false },
                bought_at: { type: Date, required: true, default: Date.now }
            }
        ],
        history: [
            {
                date: { type: Date, required: true, default: Date.now },
                value: { type: Number, required: true }
            }
        ],
        activated_on: { type: String },
        token: { type: String, required: false },
        preferences: {
            currency: { type: String, required: true, default: "USD" },
            initial_investment: { type: Number, required: true, default: 0 },
            exchanges: {
                bittrex: {
                    apiKey: { type: String, required: false },
                    apiSecret: { type: String, required: false }
                }
            }
        },
        shares: [{ type: Schema.Types.ObjectId, ref: "Share" }]
    },
    { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

export default mongoose.model<IUserModel>("User", UserSchema, "users");

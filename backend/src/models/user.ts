import mongoose from "../db";
import { Schema, Model, Document } from "mongoose";
import AbstractModel from "./AbstractModel";
import { genSalt, hashPassword } from "../utils/cypher-util";
import UserCredential, { IUserCredential, IUserCredentialDAO } from "./UserCredential";
import UserCoin, { IUserCoin, IUserCoinDAO } from "./UserCoin";
import UserPreferences, { IUserPreferences, IUserPreferencesDAO } from "./UserPreferences";
import UserShareSettings, { IUserShareSettings, IUserShareSettingsDAO } from "./UserShareSettings";

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
    shareSettings: IUserShareSettings;
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
    share_settings: IUserShareSettingsDAO;
}

export class User extends AbstractModel implements IUser {
    public static parse(user: IUserDAO): User {
        const credentials = user.credentials
            ? user.credentials.map((credential) => UserCredential.parse(credential))
            : null;

        const portfolio = user.portfolio ? user.portfolio.map((Coin) => UserCoin.parse(Coin)) : undefined;
        const shareSettings = user.share_settings ? UserShareSettings.parse(user.share_settings) : undefined;

        const userObj = new User(user.email, credentials, portfolio, user.created_on, user._id);
        userObj.shareSettings = shareSettings;
        userObj.token = user.token;
        userObj.updatedOn = user.updated_on;
        userObj.preferences = UserPreferences.parse(user.preferences);

        return userObj;
    }

    public static parseDomain(user: IUser): User {
        const credentials = user.credentials
            ? user.credentials.map((credential) => UserCredential.parseDomain(credential))
            : null;

        const portfolio = user.portfolio ? user.portfolio.map((Coin) => UserCoin.parseDomain(Coin)) : null;
        const shareSettings = user.shareSettings ? UserShareSettings.parseDomain(user.shareSettings) : undefined;

        const userObj = new User(user.email, credentials, portfolio, user.createdOn, user.id);
        userObj.shareSettings = shareSettings;
        userObj.token = user.token;
        userObj.updatedOn = user.updatedOn;
        userObj.preferences = UserPreferences.parseDomain(user.preferences);

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
    public shareSettings: UserShareSettings;

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

    public addCredentials(credentials: UserCredential) {
        this.credentials.push(credentials);
    }

    public setShareSettings(shareSettings: UserShareSettings): void {
        this.shareSettings = shareSettings;
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
            credentials,
            activated_on: this.activatedOn,
            created_on: this.createdOn,
            updated_on: this.updatedOn,
            portfolio,
            shareSettings: this.shareSettings.toDAO(),
            preferences: this.preferences.toDAO()
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
            currency: { type: String, required: true, default: "USD" },
            initial_investment: { type: Number, required: true, default: 0 }
        },
        share_settings: {
            token: { type: String, required: true },
            amount: { type: Boolean, required: true, default: false },
            bought_at: { type: Boolean, required: true, default: false },
            price: { type: Boolean, required: true, default: false },
            source: { type: Boolean, required: true, default: false }
        }
    },
    { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

export default mongoose.model<IUserModel>("User", UserSchema, "users");

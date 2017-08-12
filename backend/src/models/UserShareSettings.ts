import { Document, Model, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "./AbstractModel";
import { IUserDAO, User } from "./user";

export interface IUserShareSettings {
    id: any;
    user?: User;
    token: string;
    amount: boolean;
    graph: boolean;
    change: boolean;
    price: boolean;
}

export interface IUserShareSettingsDAO extends Document {
    _id: any;
    user: mongoose.Types.ObjectId;
    token: string;
    amount: boolean;
    graph: boolean;
    change: boolean;
    price: boolean;
}

export class UserShareSettings extends AbstractModel implements IUserShareSettings {
    public static parse(settings: any): UserShareSettings {
        const obj: UserShareSettings = new UserShareSettings(
            settings.token,
            settings.amount,
            settings.graph,
            settings.change,
            settings.price,
            settings._id
        );

        obj.user = !mongoose.Types.ObjectId.isValid(settings.user) ? User.parse(settings.user) : undefined;

        return obj;
    }

    public static parseDomain(settings: IUserShareSettings): UserShareSettings {
        return new UserShareSettings(
            settings.token,
            settings.amount,
            settings.graph,
            settings.change,
            settings.price,
            settings.id
        );
    }

    public user: User;

    constructor(
        readonly token: string,
        readonly amount: boolean = false,
        readonly graph: boolean = false,
        readonly change: boolean = false,
        readonly price: boolean = false,
        readonly id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
    ) {
        super();
    }

    public setUser(user: User) {
        this.user = user;
    }

    public toDAO(): IUserShareSettingsDAO {
        return {
            _id: this.id,
            user: this.user.id,
            token: this.token,
            amount: this.amount,
            graph: this.graph,
            change: this.change,
            price: this.price
        } as IUserShareSettingsDAO;
    }
}

export interface IShareModel extends IUserShareSettingsDAO {}

export const ShareSchema = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        token: { type: String, required: false },
        amount: { type: Boolean, required: true, default: false },
        graph: { type: Boolean, required: true, default: false },
        change: { type: Boolean, required: true, default: false },
        price: { type: Boolean, required: true, default: false }
    },
    { timestamps: { createdAt: "created_on" } }
);

export default mongoose.model<IShareModel>("Share", ShareSchema, "shares");

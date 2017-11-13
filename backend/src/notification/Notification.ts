import { Document, Model, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "../models/NewAbstractModel";

export enum INotificationType {
    ERROR,
    SUCCESS,
    INFO,
    WARNING
}

export interface INotification {
    date: Date;
    message: string;
    type: INotificationType;
    expiresOn?: Date;
    id: any;
    active: boolean;
}

export interface INotificationModel extends INotification, Document {
    _id: any;
    id: null;
}

export class Notification extends AbstractModel implements INotification {

    public static parseDomain(n: INotification) {
        const obj: Notification = new Notification(n.message, n.type, n.date);
        Object.assign(obj, n);
        return obj;
    }
    public static parse(n: INotificationModel) {
        const obj: Notification = new Notification(n.message, n.type, n.date);
        obj.id = n._id;
        // the toObject will get rid of the extra doc meta from mongoose object
        // obj = Object.assign(obj, n.toObject());
        return obj;
    }

    public id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    public date: Date;
    public expiresOn?: Date;
    public message: string;
    public type: INotificationType;
    public active: boolean = true;

    constructor(message: string, type: INotificationType = INotificationType.INFO, date: Date = new Date(), expiresOn?: Date) {
        super();
        this.message = message;
        this.date = date;
        this.type = type;
        this.expiresOn = expiresOn;
    }
}

export const NotificationSchema = new mongoose.Schema({
    _id: { type: String, required: true, auto: true },
    date: { type: Date, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    expiresOn: { type: Date, required: false },
    active: { type: Boolean, required: true, default: true }
});

export default mongoose.model<INotificationModel>("Notification", NotificationSchema, "notifications");

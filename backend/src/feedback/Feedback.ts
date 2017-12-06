import { Document, Model, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "../models/NewAbstractModel";
import { User } from "../models/user";

export interface IFeedback {
    rating: number;
    message?: string;
    createdOn: Date;
    createdBy?: User;
    data?: object;
}

export interface IFeedbackModel extends IFeedback, Document {
    _id: any;
    id: null;
}

export class Feedback extends AbstractModel implements IFeedback {

    public static parseDomain(n: IFeedback) {
        const obj: Feedback = new Feedback(n.rating, n.message, n.data);
        Object.assign(obj, n);
        return obj;
    }
    public static parse(n: IFeedbackModel) {
        const obj: Feedback = new Feedback(n.rating, n.message, n.data);
        obj.id = n._id;
        delete n._id;
        return obj;
    }

    public id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
    public rating: number;
    public createdOn: Date = new Date();
    public message?: string;
    public data?: object;
    public createdBy?: User;

    public constructor(rating: number, message?: string, data?: object) {
        super();
        this.rating = rating;
        if (message) {
            this.message = message;
        }
        if (data) {
            this.data = data;
        }
    }

    public toModel() {
        const model: any = this;
        model._id = model.id;
        if (this.createdBy) {
            model.createdBy = this.createdBy.id;
        }
        delete model.id;
        return model;
    }
}

export const FeedbackSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: [1, "Rating too low"], max: [5, "Rating too high"] },
    createdAt: { type: Date, required: true, default: new Date() },
    message: { type: String },
    data: { type: Object },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model<IFeedbackModel>("Feedback", FeedbackSchema, "feedback");

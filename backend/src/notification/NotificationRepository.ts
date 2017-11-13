import { DEVELOPMENT } from "../constants";
import mongoose from "../db";
import { MongoRepository } from "../services/NewRepository";
import NotificationModel, { INotification, INotificationModel, Notification } from "./Notification";

import * as bluebird from "bluebird";
import * as flatten from "flat";
import * as redis from "redis";

class NotificationRepository extends MongoRepository<Notification> {

    constructor() {
        super(NotificationModel, "Notification");
    }

    public findActive(): Promise<Notification[]> {
        return this.find({ active: true, expiresOn: { $gte: new Date() } });
    }
}

export default new NotificationRepository();

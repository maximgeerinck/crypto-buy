import * as moment from "moment";
import mongoose from "../db";
import { INotificationType, Notification } from "../notification/Notification";
import NotificationRepository from "../notification/NotificationRepository";

const URI = "mongodb://mongo/crypto_buy";
mongoose.connect(URI);

// create promises
const promises: any = [];

const args = process.argv.slice(2);

const message = args[0] || "";
const type = args[1] || INotificationType.INFO;
const expiresOn = moment().add("1", "days").toDate();

const notification = new Notification(message,
    INotificationType.INFO, new Date(), expiresOn);
NotificationRepository.create(notification).then(() => process.exit());

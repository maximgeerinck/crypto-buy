import * as moment from "moment";
import * as schedule from "node-schedule";
import mongoose from "../db";
import UserModel, { User } from "../models/user";
import UserCoin from "../models/UserCoin";
import UserService from "../services/UserService";

const DEMO_USER = "demo@cryptotrackr.com";

const portfolioDemo = [
    new UserCoin("ethereum", 12.568, "gdax.com", 211.6938, moment("2017, 05, 31", "YYYY, MM, DD").toDate()),
    new UserCoin("ethereum", 1.478, "liqui.io", 211.6938, moment("2017, 05, 31", "YYYY, MM, DD").toDate()),
    new UserCoin("bitcoin", 1, "poloniex", 3000, moment("2017, 06, 04", "YYYY, MM, DD").toDate()),
    new UserCoin("stratis", 235.59520371, "liqui.io", 2.2),
    new UserCoin("ripple", 1000, "liqui.io", 0.17, moment("2017, 06, 01", "YYYY, MM, DD").toDate())
];

const resetDemoUser = () => {
    return UserService.findOneById("595feaa4017f8a001444893d")
        .then((user) => {
            user.preferences.currency = "USD";
            user.preferences.initialInvestment = 3500;
            user.portfolio = portfolioDemo;
            user.shares = [];
            UserService.update(user);
        })
        .catch((err) => console.log(err));
};

class ResetDemoTask {
    public start() {
        // execute every time the minute = 1
        schedule.scheduleJob("*/5 * * * *", () => {
            console.log(`${moment.now()}: reseting demo user...`);
            resetDemoUser();
        });
    }
}

export default ResetDemoTask;

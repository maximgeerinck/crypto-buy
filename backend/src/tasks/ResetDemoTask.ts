import mongoose from '../db';
import * as schedule from 'node-schedule';
import * as moment from 'moment';
import UserModel, { User } from '../models/user';
import UserService from '../services/UserService';
import UserCoin from '../models/UserCoin';

const DEMO_USER = 'demo@cryptotrackr.com';

const portfolioDemo = [
    new UserCoin('ETH', 12.568, 'gdax.com', 211.6938, moment('2017, 05, 31', 'YYYY, MM, DD').toDate()),
    new UserCoin('ETH', 1.478, 'liqui.io', 211.6938, moment('2017, 05, 31', 'YYYY, MM, DD').toDate()),
    new UserCoin('XRP', 2500, 'poloniex', 0.015331426, moment('2017, 06, 04', 'YYYY, MM, DD').toDate()),
    new UserCoin('STRT', 235.59520371, 'liqui.io', 2.2),
    new UserCoin('GNT', 1000, 'liqui.io', 0.480048, moment('2017, 06, 01', 'YYYY, MM, DD').toDate())
];

const resetDemoUser = () => {
    return UserService.findUserByEmail(DEMO_USER)
        .then(user => {
            user.portfolio = portfolioDemo;
            UserService.update(user);
        })
        .catch(err => console.log(err));

}

class ResetDemoTask {
    start() {
        // execute every time the minute = 1
        schedule.scheduleJob('30 * * * *', () => {
            console.log(`${moment.now()}: reseting demo user...`);
            resetDemoUser();
        });
    }
}

export default ResetDemoTask;

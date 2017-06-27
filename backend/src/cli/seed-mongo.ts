import mongoose from '../db';
import * as moment from 'moment';
import User, { User as DomainUser, UserCurrency as DomainUserCurrency } from '../models/user';

let now = moment();

const URI = 'mongodb://mongo/crypto_buy';
mongoose.connect(URI);

// create promises
let promises: any = [];

// - USERS

const portfolioMaxim = [
  new DomainUserCurrency('ETH', 1.039, 'gdax.com'),
  new DomainUserCurrency('ETH', 0.45596604, 'liqui.io'),
  new DomainUserCurrency('SC', 2453.89379504, 'poloniex'),
  new DomainUserCurrency('ICN', 235.59520371, 'liqui.io'),
  new DomainUserCurrency('MYST', 5.00436856, 'liqui.io'),
  new DomainUserCurrency('CFI', 1298.7, 'liqui.io')
];
let users: Array<DomainUser> = [new DomainUser('geerinck.maxim@gmail.com', null, portfolioMaxim)];
promises.push.apply(
  promises,
  users.map(user => {
    return new Promise(resolve => {
      let userModel = new User(user.toDAO());
      userModel
        .save()
        .then(obj => {
          console.log(`saved user - ${obj.email}`);
          resolve();
        })
        .catch(err => {
          console.log(err);
        });
    });
  })
);

// delete everything, then seed
const deleteAll = new Promise(resolve => {
  User.collection.drop();
  resolve();
  return 0;
});

deleteAll
  .then(() => promises.reduce((p: any, fn: any) => p.then(fn), Promise.resolve()))
  .then(() => mongoose.connection.close())
  .catch(() => mongoose.connection.close());

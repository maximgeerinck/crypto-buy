import mongoose from "../db";
import * as moment from "moment";
import UserModel, { User } from "../models/user";
import DomainUserCoin from "../models/UserCoin";
import UserPreferences from "../models/UserPreferences";
import UserService from "../services/UserService";
import { fetchCurrency } from "../tasks/CurrencyTask";
import { fetchPrice } from "../tasks/PriceTask";

let now = moment();

const URI = "mongodb://mongo/crypto_buy";
mongoose.connect(URI);

// create promises
let promises: any = [];

// - USERS
const portfolioMaxim = [
    new DomainUserCoin("ethereum", 1.039, "gdax.com", 211.6938, moment("2017, 05, 31", "YYYY, MM, DD").toDate()),
    new DomainUserCoin("ethereum", 0.00324104, "liqui.io", 211.6938, moment("2017, 05, 31", "YYYY, MM, DD").toDate()),
    new DomainUserCoin(
        "siacoin",
        2453.89379504,
        "poloniex",
        0.015331426,
        moment("2017, 06, 04", "YYYY, MM, DD").toDate()
    ),
    new DomainUserCoin("iconomi", 235.59520371, "liqui.io", 2.2),
    new DomainUserCoin("mysterium", 5.00436856, "liqui.io", 2),
    new DomainUserCoin("cofound-it", 1298.7, "liqui.io", 0.1725),
    new DomainUserCoin("mobilego", 64.935, "liqui.io", 1.59, moment("2017, 06, 28", "YYYY, MM, DD").toDate())
];

let preferences = new UserPreferences("EUR");

const userPromise = () => {
    let userPromises: any[] = [];
    let users: User[] = [
        new User("geerinck.maxim@gmail.com", [], portfolioMaxim),
        new User("demo@cryptotrackr.com", [], [])
    ];

    users.map((user) => {
        const creation = () => {
            // create credentials
            return UserService.createCredentials("fa6YR5Zx")
                .then((credentials) => {
                    user.credentials.push(credentials);
                    user.preferences = preferences;

                    const dao = user.toDAO();

                    // create user
                    const userModel = new UserModel(dao);
                    return userModel.save();
                })
                .then((user) => {
                    console.log(`saved user - ${user.email}`);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        userPromises.push(creation);
    });

    return userPromises;
};

// delete everything, then seed
const deleteAll = new Promise((resolve) => {
    UserModel.collection.drop();
    resolve();
    return 0;
});

deleteAll
    .then(() => {
        return Promise.all(userPromise().map((user) => user()));
    })
    .then(fetchCurrency)
    .then(fetchPrice)
    .then(() => mongoose.connection.close())
    .catch((err) => {
        console.log(err);
        mongoose.connection.close();
    });

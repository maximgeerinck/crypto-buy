import * as moment from "moment";
import { Coin } from "../../coin/Coin";
import CoinCollectionModel from "../../coin/CoinCollection";
import mongoose from "../../db";
import UserModel, { User } from "../../models/user";
import DomainUserCoin from "../../models/UserCoin";
import UserPreferences from "../../models/UserPreferences";
import UserService from "../../services/UserService";
import { fetchCurrency } from "../../tasks/CurrencyTask";
import { fetchPrice } from "../../tasks/PriceTask";

let now = moment();

const URI = "mongodb://mongo/crypto_buy";
mongoose.connect(URI);

// fetch coin list
CoinCollectionModel.findOne({}).sort({ _id: -1 }).then((record: any) => {
    // make map with symbol as key
    let map: any = {};
    for (const coin of record.coins) {
        map[coin.symbol] = coin;
    }

    UserModel.find({}).then((users: any) => {
        for (const user of users) {
            // update portfolio
            for (const coin of user.portfolio) {
                if (!coin.coin_id) {
                    const c = JSON.parse(JSON.stringify(coin));
                    if (c.symbol === "ICN") {
                        coin.coin_id = "iconomi";
                    } else {
                        if (c.symbol === undefined || map[c.symbol.toUpperCase()] === undefined) {
                            console.log(c);
                            coin.coin_id = "ethereum";
                        } else {
                            coin.coin_id = map[c.symbol.toUpperCase()].id;
                        }
                    }

                    delete coin.symbol;
                }
            }
            user.update(user).then((u: any) => console.log(`updated user`)).catch((err: any) => console.log(err));
        }
    });
});

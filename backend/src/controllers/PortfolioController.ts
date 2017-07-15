import Coin from "../models/Coin";
import User, { User as DomainUser } from "../models/user";
import UserCoin, { IUserCoin } from "../models/UserCoin";
import * as Hapi from "hapi";
import UserService from "../services/UserService";
import * as moment from "moment";

import ResetDemoTask from "../tasks/ResetDemoTask";

export const BOUGHT_AT_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

class PortfolioController {
    /**
   * 
   * date format: 2017-10-10T14:13
   * @param {Hapi.Request} req 
   * @param {Hapi.ReplyNoContinue} reply 
   * @returns 
   * @memberof PortfolioController
   */
    addCoins(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const coins = req.payload.map(
            (coin: IUserCoin) =>
                new UserCoin(
                    coin.symbol,
                    coin.amount,
                    coin.source,
                    coin.boughtPrice,
                    moment(coin.boughtAt, BOUGHT_AT_FORMAT).toDate()
                )
        );

        Array.prototype.push.apply(req.auth.credentials.portfolio, coins);

        return UserService.update(req.auth.credentials).then((user) => {
            // refactor request object
            let coins = user.portfolio;
            coins.forEach((coin: any) => {
                coin.id = coin._id;
                delete coin._id;
            });
            reply(coins);
        });
    }

    /**
   * Updates a coin in a portfolio
   * 
   * @param {Hapi.Request} req 
   * @param {Hapi.ReplyNoContinue} reply 
   * @memberof PortfolioController
   */
    updateCoin(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { id, symbol, boughtPrice, amount, boughtAt, source } = req.payload;

        let user: DomainUser = req.auth.credentials;

        for (let key in user.portfolio) {
            let coin = user.portfolio[key];
            if (coin._id == id) {
                user.portfolio[key].symbol = symbol;
                user.portfolio[key].amount = amount;
                user.portfolio[key].boughtAt = boughtAt;
                user.portfolio[key].boughtPrice = boughtPrice;
                user.portfolio[key].source = source;
            }
        }

        UserService.update(user).then((user) => {
            // refactor request object
            let coins = user.portfolio;
            coins.forEach((coin: any) => {
                coin.id = coin._id;
                delete coin._id;
            });
            reply(coins);
        });
    }

    /**
 * Removes a coin from a portfolio
 * 
 * @param {Hapi.Request} req 
 * @param {Hapi.ReplyNoContinue} reply 
 * @memberof PortfolioController
 */
    removeCoin(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { id } = req.payload;

        let user: DomainUser = req.auth.credentials;

        UserService.removeCoin(id, user).then(() => {
            reply(user.portfolio.filter((uc) => uc._id != id));
        });
    }

    /**
     * Views the portfolio, which coins it contains
     * 
     * @param {Hapi.Request} req 
     * @param {Hapi.ReplyNoContinue} reply 
     * @memberof PortfolioController
     */
    index(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let coins = req.auth.credentials.portfolio;
        coins.forEach((coin: any) => {
            coin.id = coin._id;
            delete coin._id;
        });
        return reply(coins);
    }
}

export default new PortfolioController();

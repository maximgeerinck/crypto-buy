import * as Boom from "boom";
import * as Hapi from "hapi";
import * as moment from "moment";
import Coin from "../models/Coin";
import User, { User as DomainUser } from "../models/user";
import UserCoin, { IUserCoin } from "../models/UserCoin";
import UserShareSettings, { IUserShareSettings } from "../models/UserShareSettings";
import CoinRepository from "../services/CoinRepository";
import UserService from "../services/UserService";
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
    public addCoins(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const coins = req.payload.map(
            (coin: IUserCoin) =>
                new UserCoin(
                    coin.coinId,
                    coin.amount,
                    coin.source,
                    coin.boughtPrice,
                    moment(coin.boughtAt, BOUGHT_AT_FORMAT).toDate()
                )
        );

        Array.prototype.push.apply(req.auth.credentials.portfolio, coins);

        return UserService.update(req.auth.credentials).then((user) => {
            // refactor request object
            const coins = user.portfolio;
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
    public updateCoin(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { id, coinId, boughtPrice, amount, boughtAt, source } = req.payload;

        const user: DomainUser = req.auth.credentials;

        for (const key in user.portfolio) {
            const coin = user.portfolio[key];
            if (coin.id === id) {
                user.portfolio[key] = new UserCoin(coinId, amount, source, boughtPrice, boughtAt);
            }
        }

        UserService.update(user).then((user) => {
            // refactor request object
            const coins = user.portfolio;
            coins.forEach((coin: any) => {
                coin.id = coin.id;
                delete coin.id;
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
    public removeCoin(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { id } = req.payload;

        const user: DomainUser = req.auth.credentials;

        UserService.removeCoin(id, user).then(() => {
            reply(user.portfolio.filter((uc) => uc.id !== id));
        });
    }

    /**
     * Views the portfolio, which coins it contains
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof PortfolioController
     */
    public index(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const coins = req.auth.credentials.portfolio;
        coins.forEach((coin: any) => {
            coin.id = coin.id;
        });
        return reply(coins);
    }

    /**
     * Create a shared link
     * @param req
     * @param reply
     */
    public share(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: DomainUser = req.auth.credentials;
        const settings: any = req.payload.settings;

        UserService.sharePortfolio(user, settings.price, settings.source, settings.boughtAt, settings.amount)
            .then((shareSettings) => {
                reply(shareSettings);
            })
            .catch((err) => {
                if (err === "E_NOT_FOUND") {
                    return reply(Boom.notFound());
                }
                return reply(Boom.badRequest());
            });
    }

    public sharedPortfolio(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { token } = req.params;
        UserService.getSharedPortfolio(token)
            .then((result: any) => {
                const portfolio: any = {};

                // unique values
                for (const coin of result) {
                    portfolio[coin.coinId] = coin;
                }

                // link them to current value
                CoinRepository.findCoinsByIds(Object.keys(portfolio))
                    .then((details) => {
                        for (const coinDetail of details) {
                            portfolio[coinDetail.id].details = coinDetail;
                        }

                        reply(portfolio);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                if (err === "E_NOT_FOUND") {
                    return reply(Boom.notFound());
                }
                return reply(Boom.badRequest());
            });
    }
}

export default new PortfolioController();

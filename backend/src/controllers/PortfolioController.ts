import * as Boom from "boom";
import * as Hapi from "hapi";
import * as moment from "moment";
import { Coin } from "../coin/Coin";
import CoinCollectionRepository from "../coin/CoinCollectionRepository";
import User, { User as DomainUser } from "../models/user";
import UserCoin, { IUserCoin } from "../models/UserCoin";
import UserShareSettings, { IUserShareSettings } from "../models/UserShareSettings";
import BittrexExchange from "../portfolio/exchange/bittrex";
import PortfolioService from "../portfolio/PortfolioService";
import UserService from "../services/UserService";
import ResetDemoTask from "../tasks/ResetDemoTask";
import * as CacheHelper from "../utils/CacheHelper";

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
    public async addCoins(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const coins = req.payload.map(
            (coin: IUserCoin) =>
                new UserCoin(
                    coin.coinId,
                    coin.amount,
                    coin.source,
                    coin.boughtPrice,
                    coin.currency,
                    moment(coin.boughtAt, BOUGHT_AT_FORMAT).toDate()
                )
        );

        Array.prototype.push.apply(req.auth.credentials.portfolio, coins);

        return UserService.update(req.auth.credentials).then(async (user) => {

            await CacheHelper.invalidate(`portfolio/aggregate/${user.id}`);

            // refactor request object
            const c = user.portfolio;
            c.forEach((coin: any) => {
                coin.id = coin._id;
                delete coin._id;
            });

            const portfolio = await PortfolioService.aggregatePortfolio(user);

            reply(portfolio);
        });
    }

    /**
     * Updates a coin in a portfolio
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof PortfolioController
     */
    public async updateCoin(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { id, coinId, boughtPrice, amount, currency, boughtAt, source } = req.payload;

        const user: DomainUser = req.auth.credentials;

        for (let i = 0; i < user.portfolio.length; i++) {
            const coin = user.portfolio[i];

            if (String(coin.id) === String(id)) {
                user.portfolio[i] = new UserCoin(coinId, amount, source, boughtPrice, currency, boughtAt);
            }
        }

        try {
            const newUser = await UserService.update(user);
            await CacheHelper.invalidate(`portfolio/aggregate/${user.id}`);
            const portfolio = await PortfolioService.aggregatePortfolio(newUser);
            reply(portfolio);
        } catch (ex) {
            console.log(ex);
            reply(Boom.badRequest());
        }

    }

    /**
     * Removes a coin from a portfolio
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof PortfolioController
     */
    public async removeCoin(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { id } = req.payload;
        const user: DomainUser = req.auth.credentials;

        await UserService.removeCoin(id, user);
        await CacheHelper.invalidate(`portfolio/aggregate/${user.id}`);

        user.portfolio = user.portfolio.filter((uc) => String(uc.id) !== String(id));
        const portfolio = await PortfolioService.aggregatePortfolio(user);

        reply(portfolio);
    }

    /**
     * Views the portfolio, which coins it contains
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof PortfolioController
     */
    public async index(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: DomainUser = req.auth.credentials;
        const coins = await PortfolioService.aggregatePortfolio(user);
        return reply(coins);

    }
}

export default new PortfolioController();

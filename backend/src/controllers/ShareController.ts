import * as Boom from "boom";
import * as Hapi from "hapi";
import * as moment from "moment";
import * as path from "path";
import CoinRepository from "../coin/CoinCollectionRepository";
import User, { User as DomainUser } from "../models/user";
import UserShareSettings, { IUserShareSettings } from "../models/UserShareSettings";
import PortfolioService from "../portfolio/PortfolioService";
import ShareRepository from "../services/ShareRepository";
import UserService from "../services/UserService";
import * as PortfolioHelper from "../utils/PortfolioHelper";

const { createCanvas, loadImage } = require("canvas");

import * as fs from "fs";

class ShareController {
    public async retrieve(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        // await PortfolioService.aggregatePortfolio(newUser);
        const share = await ShareRepository.findOneByToken(req.params.token);
        const coins = await CoinRepository.findAllWithHistory();
        const p = await PortfolioService.aggregatePortfolio(share.user);

        // bind
        const portfolio = PortfolioHelper.bindPortfolioToCoin(p, coins);

        // apply share rules
        Object.keys(portfolio).forEach((item: any) => {
            if (!share.amount) {
                delete portfolio[item].amount;
            }
            if (!share.price) {
                delete portfolio[item].boughtPrice;
                delete portfolio[item].boughtAt;
            }
        });

        const settings = {
            amount: share.amount,
            graph: share.graph,
            change: share.change,
            price: share.price
        };

        reply({
            settings,
            currency: share.user.preferences.currency,
            portfolio
        });

        // ShareRepository.findOneByToken(req.params.token)
        //     .then((share) => {
        //         const portfolio: any = {};
        //         let totalAmount = 0;
        //         // unique values
        //         for (const coin of share.user.portfolio) {
        //             if (portfolio[coin.coinId]) {
        //                 portfolio[coin.coinId].amount += coin.amount;

        //                 // weighted average of price
        //                 portfolio[coin.coinId].boughtPrice =
        //                     (portfolio[coin.coinId].boughtPrice * portfolio[coin.coinId].amount +
        //                         coin.boughtPrice * coin.amount) /
        //                     (portfolio[coin.coinId].amount + coin.amount);
        //             } else {
        //                 portfolio[coin.coinId] = coin;
        //             }
        //         }

        //         // // link them to current value

        //         return CoinRepository.findAllWithHistory().then((results: any) => {
        //             const details = [];
        //             for (const coin of Object.keys(portfolio)) {
        //                 details.push(results[coin]);
        //             }

        //             // get total amount
        //             if (!share.user.preferences.initialInvestment || share.user.preferences.initialInvestment === 0) {
        //                 totalAmount = details.reduce((sum, value) => {
        //                     if (portfolio[value.coinId]) {
        //                         return sum + portfolio[value.coinId].amount * portfolio[value.coinId].boughtPrice;
        //                     }
        //                 }, 0);
        //             } else {
        //                 totalAmount = share.user.preferences.initialInvestment;
        //             }

        //             // coin details
        //             for (const coinDetail of details) {
        //                 if (!coinDetail) {
        //                     continue;
        //                 }

        //                 portfolio[coinDetail.coin_id].details = coinDetail;

        //                 if (!share.graph && !share.amount) {
        //                     delete portfolio[coinDetail.coin_id].amount;
        //                 }

        //                 // if show graph but not amount, feed it percentages 0-1
        //                 if (share.graph && (!share.amount || !share.price)) {
        //                     portfolio[coinDetail.coin_id].amount =
        //                         portfolio[coinDetail.coin_id].amount *
        //                         portfolio[coinDetail.coin_id].boughtPrice /
        //                         totalAmount;
        //                 }

        //                 // if you don't want to share price, delete them
        //                 if (!share.price) {
        //                     delete portfolio[coinDetail.coin_id].boughtPrice;
        //                     delete portfolio[coinDetail.coin_id].boughtAt;
        //                 }
        //             }

        //             reply({
        //                 settings: {
        //                     amount: share.amount,
        //                     graph: share.graph,
        //                     change: share.change,
        //                     price: share.price
        //                 },
        //                 currency: share.currency,
        //                 portfolio
        //             });
        //         });
        //     })
        //     .catch((err) => {
        //         console.log(`ERROR IN ${req.params.token}`);
        //         console.log(err);
        //         reply(Boom.badRequest("E_NOT_FOUND"));
        //     });
    }

    public async banner(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        // get coins and their images from your portfolio
        const share = await ShareRepository.findShare(req.params.token);
        const coins = await CoinRepository.findAllWithHistory();
        const p = await PortfolioService.aggregatePortfolio(share.user);

        // bind
        const portfolio = PortfolioHelper.bindPortfolioToCoin(p, coins);

        const coinAmount = Object.keys(portfolio).length;
        const iconSize = 32;
        const padding = 10;

        const PROMOTION_TEXT_HEIGHT = 10;
        const height = iconSize + padding * 2 + PROMOTION_TEXT_HEIGHT;
        let width = iconSize * coinAmount + padding * (coinAmount + 1) + PROMOTION_TEXT_HEIGHT;

        if (width <= 50) {
            width = 50;
        }

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        const stream = canvas.pngStream();

        try {
            for (let i = 0; i < coinAmount; i++) {

                const x = i * iconSize + (i + 1) * padding;
                const y = padding;

                const image = await loadImage(
                    path.join(__dirname, "../../public/coins", `${Object.keys(portfolio)[i]}.png`));

                ctx.drawImage(image, x, y, iconSize, iconSize);
            }

            ctx.font = "10px Impact";
            ctx.fillText("My portfolio at cryptotrackr.com", 10, height - 5);

        } catch (err) {
            console.log(err);
        }

        reply(stream).header("Content-Type", "image/png");
    }

    /**
     * Create a shared link
     * @param req
     * @param reply
     */
    public share(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: DomainUser = req.auth.credentials;
        const settings: any = req.payload.settings;
        const currency: any = req.payload.currency;

        UserService.sharePortfolio(user, settings.amount, settings.graph, settings.change, settings.price, currency)
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

    public delete(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = req.params.id;
        ShareRepository.delete(id).then(() => reply({ success: true }));
    }
}

export default new ShareController();

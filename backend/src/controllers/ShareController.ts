import * as Boom from "boom";
import * as Hapi from "hapi";
import * as moment from "moment";
import * as path from "path";
import CoinRepository from "../coin/CoinRepository";
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

        try {
            const share = await ShareRepository.findOneByToken(req.params.token);
            const coins = await CoinRepository.findAllWithHistory();
            const p = await PortfolioService.aggregatePortfolio(share.user);

            // bind
            const portfolio = PortfolioHelper.bindPortfolioToCoin(p, coins);

            const totalAmount = Object.keys(portfolio).reduce((sum, value) => {
                if (portfolio[value] && portfolio[value].details.history) {
                    const price = portfolio[value].details.history[portfolio[value].details.history.length - 1].usd;
                    return sum + portfolio[value].amount * price;
                }
            }, 0);

            // apply share rules
            Object.keys(portfolio).forEach((item: any) => {

                portfolio[item].details = {
                    ...portfolio[item].details,
                    price: portfolio[item].details.history[portfolio[item].details.history.length - 1].usd,
                    changes: portfolio[item].details.history[portfolio[item].details.history.length - 1].change
                };

                if (!share.amount) {
                    // amount in percents to make graph work
                    // delete portfolio[item].amount;
                    if (share.graph) {
                        portfolio[item].amount = portfolio[item].amount * portfolio[item].details.price / totalAmount;
                    } else {
                        delete portfolio[item].amount;
                    }
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
        } catch (ex) {
            console.log(ex);
            reply(Boom.badRequest());
        }

    }

    public async banner(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        // get coins and their images from your portfolio
        const share = await ShareRepository.findShare(req.params.token);
        const coins = await CoinRepository.findAllWithHistory();
        const p = await PortfolioService.aggregatePortfolio(share.user);

        // bind
        const portfolio = PortfolioHelper.bindPortfolioToCoin(p, coins);
        try {
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

            for (let i = 0; i < coinAmount; i++) {

                    const x = i * iconSize + (i + 1) * padding;
                    const y = padding;

                    const image = await loadImage(
                        path.join(__dirname, "../../public/coins", `${Object.keys(portfolio)[i]}.png`));

                    ctx.drawImage(image, x, y, iconSize, iconSize);
                }

            ctx.font = "10px Impact";
            ctx.fillText("My portfolio at cryptotrackr.com", 10, height - 5);
            reply(stream).header("Content-Type", "image/png");

        } catch (err) {
            if (err.indexOf("error while reading from input stream") > -1) {
                console.log(`[Image error] Could not load: ${Object.keys(portfolio).join(", ")}`);
            } else {
                console.log(err);
            }
            reply(Boom.badRequest());
        }
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

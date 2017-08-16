import * as Boom from "boom";
import * as Hapi from "hapi";
import * as moment from "moment";
import User, { User as DomainUser } from "../models/user";
import UserShareSettings, { IUserShareSettings } from "../models/UserShareSettings";
import CoinRepository from "../services/CoinRepository";
import ShareRepository from "../services/ShareRepository";
import UserService from "../services/UserService";

class ShareController {
    public retrieve(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        ShareRepository.findOneByToken(req.params.token)
            .then((share) => {
                const portfolio: any = {};
                let totalAmount = 0;
                // unique values
                for (const coin of share.user.portfolio) {
                    if (portfolio[coin.coinId]) {
                        portfolio[coin.coinId].amount += coin.amount;

                        // weighted average of price
                        portfolio[coin.coinId].boughtPrice =
                            (portfolio[coin.coinId].boughtPrice * portfolio[coin.coinId].amount +
                                coin.boughtPrice * coin.amount) /
                            (portfolio[coin.coinId].amount + coin.amount);
                    } else {
                        portfolio[coin.coinId] = coin;
                    }
                }

                // // link them to current value
                return CoinRepository.findCoinsByIds(Object.keys(portfolio)).then((details) => {
                    if (!share.user.preferences.initialInvestment || share.user.preferences.initialInvestment === 0) {
                        totalAmount = details.reduce((sum, value) => {
                            return sum + portfolio[value.id].amount * portfolio[value.id].boughtPrice;
                        }, 0);
                    } else {
                        totalAmount = share.user.preferences.initialInvestment;
                    }

                    for (const coinDetail of details) {
                        portfolio[coinDetail.id].details = coinDetail;

                        if (!share.graph && !share.amount) {
                            delete portfolio[coinDetail.id].amount;
                        }

                        // if show graph but not amount, feed it percentages 0-1
                        if (share.graph && !share.amount) {
                            portfolio[coinDetail.id].amount =
                                portfolio[coinDetail.id].amount * portfolio[coinDetail.id].boughtPrice / totalAmount;
                        }

                        if (!share.price) {
                            delete portfolio[coinDetail.id].boughtPrice;
                            delete portfolio[coinDetail.id].boughtAt;
                        }
                    }

                    reply({
                        settings: {
                            amount: share.amount,
                            graph: share.graph,
                            change: share.change,
                            price: share.price
                        },
                        portfolio
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                reply(Boom.badRequest("E_NOT_FOUND"));
            });
    }

    /**
     * Create a shared link
     * @param req
     * @param reply
     */
    public share(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: DomainUser = req.auth.credentials;
        const settings: any = req.payload.settings;

        UserService.sharePortfolio(user, settings.amount, settings.graph, settings.change, settings.price)
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

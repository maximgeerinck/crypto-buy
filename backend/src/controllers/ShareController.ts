import * as Boom from "boom";
import * as Hapi from "hapi";
import * as moment from "moment";
import CoinRepository from "../coin/CoinCollectionRepository";
import User, { User as DomainUser } from "../models/user";
import UserShareSettings, { IUserShareSettings } from "../models/UserShareSettings";
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

                return CoinRepository.findAllWithHistory().then((results: any) => {
                    const details = [];
                    for (const coin of Object.keys(portfolio)) {
                        details.push(results[coin]);
                    }

                    // get total amount
                    if (!share.user.preferences.initialInvestment || share.user.preferences.initialInvestment === 0) {
                        totalAmount = details.reduce((sum, value) => {
                            if (portfolio[value.coinId]) {
                                return sum + portfolio[value.coinId].amount * portfolio[value.coinId].boughtPrice;
                            }
                        }, 0);
                    } else {
                        totalAmount = share.user.preferences.initialInvestment;
                    }

                    // coin details
                    for (const coinDetail of details) {
                        portfolio[coinDetail.coin_id].details = coinDetail;

                        if (!share.graph && !share.amount) {
                            delete portfolio[coinDetail.coin_id].amount;
                        }

                        // if show graph but not amount, feed it percentages 0-1
                        if (share.graph && !share.amount) {
                            portfolio[coinDetail.coin_id].amount =
                                portfolio[coinDetail.coin_id].amount *
                                portfolio[coinDetail.coin_id].boughtPrice /
                                totalAmount;
                        }

                        // if you don't want to share price, delete them
                        if (!share.price) {
                            delete portfolio[coinDetail.coin_id].boughtPrice;
                            delete portfolio[coinDetail.coin_id].boughtAt;
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
                console.log(`ERROR IN ${req.params.token}`);
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

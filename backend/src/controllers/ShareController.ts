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
        ShareRepository.findOneByToken(req.params.token).then((share) => {
            const portfolio: any = {};

            // unique values
            for (const coin of share.user.portfolio) {
                if (portfolio[coin.coinId]) {
                    portfolio[coin.coinId].amount += coin.amount;
                } else {
                    portfolio[coin.coinId] = coin;
                }
            }

            //             public getSharedPortfolio(token: string): Promise<any> {
            //     return UserRepository.getUserSharedPortfolio(token).then((user) => {
            //         // const portfolio: any = [];
            //         // const settings: UserShareSettings[] = user.shares;
            //         // for (const coin of user.portfolio) {
            //         //     portfolio.push(
            //         //         Object.assign(
            //         //             { coinId: coin.coinId },
            //         //             settings.amount && { amount: coin.amount },
            //         //             settings.boughtAt && { boughtAt: coin.boughtAt },
            //         //             settings.price && { boughtPrice: coin.boughtPrice },
            //         //             settings.source && { source: coin.source }
            //         //         )
            //         //     );
            //         // }
            //         // return portfolio;
            //     });
            // }

            // // link them to current value
            CoinRepository.findCoinsByIds(Object.keys(portfolio))
                .then((details) => {
                    for (const coinDetail of details) {
                        portfolio[coinDetail.id].details = coinDetail;
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
                })
                .catch((err) => {
                    console.log(err);
                });
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

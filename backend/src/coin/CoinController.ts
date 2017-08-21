import * as Hapi from "hapi";
import User from "../models/user";
import { Coin } from "./Coin";
import CoinCollection from "./CoinCollection";
import CoinCollectionRepository from "./CoinCollectionRepository";

class CoinController {
    /**
     * Returns all coins
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof CoinController
     */
    public all(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const limit = req.params.limit;

        CoinCollection.find({})
            .select("coins.coin_id coins.name coins.symbol coins.price.usd coins.change")
            .sort({ _id: -1 })
            .limit(parseInt(limit, 10))
            .then((result: any) => {
                const output = result.map((res: any) => {
                    const map: any = {};
                    for (let i = 0; i < res.coins.length; i++) {
                        map[res.coins[i].coin_id] = res.coins[i];
                    }
                    return map;
                });

                reply(output);
            });
    }

    /**
     * Returns the statistics of given coins
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof CoinController
     */
    public details(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { coins } = req.payload;

        CoinCollectionRepository.findAllWithHistory().then((result: any) => {
            const output = [];
            for (const coin of coins) {
                output.push(result[coin]);
            }

            reply(output);
        });
    }
}

export default new CoinController();

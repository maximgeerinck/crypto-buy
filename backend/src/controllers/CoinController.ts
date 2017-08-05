import Coin from "../models/Coin";
import User from "../models/user";
import * as Hapi from "hapi";

class CoinController {
    /**
   * Returns all coins
   * 
   * @param {Hapi.Request} req 
   * @param {Hapi.ReplyNoContinue} reply 
   * @memberof CoinController
   */
    all(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const limit = req.params.limit;

        Coin.find({})
            .select("coins.id coins.name coins.symbol coins.price.usd coins.change")
            .sort({ _id: -1 })
            .limit(parseInt(limit))
            .then((result: any) => {
                let output = result.map((res: any) => {
                    let map: any = {};
                    for (let i = 0; i < res.coins.length; i++) {
                        map[res.coins[i].id] = res.coins[i];
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
    details(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { coins } = req.payload;

        Coin.findOne({})
            .select("coins.id coins.name coins.symbol coins.rank coins._id coins.change coins.price.usd")
            .sort({ _id: -1 })
            .then((details: any) => {
                let result = details.coins.filter((detail: any) => {
                    return ~coins.indexOf(detail.id); // will go to false/true
                });

                reply(result);
            });
    }
}

export default new CoinController();

import * as Hapi from "hapi";
import User from "../models/user";
import * as CacheHelper from "../utils/CacheHelper";
import { Coin } from "./Coin";
import CoinRepository from "./CoinRepository";

const CACHE_ALL = "coins/all/name_and_symbol";

class CoinController {
    /**
     * Returns all coins
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof CoinController
     */
    public async all(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const limit = req.params.limit;

        const cacheResult = await CacheHelper.get(CACHE_ALL);
        if (cacheResult) {
            return reply(cacheResult);
        }

        const coins = await CoinRepository.findDistinctMappedByIdentifier();
        for (const key of Object.keys(coins)) {
            delete coins[key].history;
            delete coins[key].id;
            delete coins[key].rank;
            delete coins[key].marketCap;
            delete coins[key].supply;
            delete coins[key].coinId;
        }

        CacheHelper.cache(CACHE_ALL, coins, CacheHelper.HOUR);

        return reply(coins);
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

        CoinRepository.findAllWithHistory().then((result: any) => {
            if (result) {
                const output = [];
                for (const coin of coins) {
                    if (result[coin]) {
                        const res = { ...result[coin] };
                        res.price = res.history[res.history.length - 1].usd;
                        res.changes = res.history[res.history.length - 1].change;
                        output.push(res);
                    }

                }

                return reply(output);
            }
            return reply([]);

        });
    }

    public detailsIncrement(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { coins } = req.payload;

        CoinRepository.findAllWithHistory().then((result: any) => {
            const output = [];
            for (const coin of coins) {
                const res = { ...result[coin] };
                res.price = res.history[res.history.length - 1].usd;
                res.changes = res.history[res.history.length - 1].change;
                delete res.history;
                delete res.price.change;
                delete res.name;
                delete res.symbol;
                delete res.rank;
                delete res.marketCap;
                delete res.supply;
                delete res.price.timestamp;
                delete res.id;
                output.push(res);
            }

            reply(output);
        });
    }

    public async stats(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        const { coins } = req.payload;
        const stats = await CoinRepository.stats();

        const output: any = {};

        for (const key of coins) {
            output[key] = stats[key];
        }
        return reply(output);

    }
}

export default new CoinController();

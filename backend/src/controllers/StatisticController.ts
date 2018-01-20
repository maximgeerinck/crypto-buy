import * as Boom from "boom";
import * as Hapi from "hapi";
import * as moment from "moment";
import CoinRepository from "../coin/CoinRepository";

class StatisticController {
    /**
     * Get Statistics for given coins
     *
     * @param {Hapi.Request} req
     * @param {Hapi.ReplyNoContinue} reply
     * @memberof StatisticController
     */
    public index(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { coins } = req.payload;

        CoinRepository.sparklineWeek(coins).then((data: any) => {
            return reply(data);
        });
    }
}

export default new StatisticController();

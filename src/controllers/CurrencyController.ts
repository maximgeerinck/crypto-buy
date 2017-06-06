import eth from '../models/eth';
import * as Hapi from "hapi";

class CurrencyController {
    all(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        const limit = req.params.limit;

        eth.find({})
            .select('created_on symbol name supply change price.usd price.eur volume.usd volume.eur market_cap.usd market_cap.eur')
            .sort({created_on: -1})
            .limit(parseInt(limit))
            .then(currencies => {
                reply(currencies);
            })
    }
}

export default new CurrencyController();
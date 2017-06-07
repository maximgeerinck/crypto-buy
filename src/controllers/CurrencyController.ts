import Currency from '../models/Currency';
import * as Hapi from "hapi";

class CurrencyController {
    all(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        const limit = req.params.limit;

        Currency.find({})
            .select('currencies.id currencies.name currencies.symbol currencies.price.usd currencies.change')
            .sort({created_on: -1})
            .limit(parseInt(limit))
            .then(currencies => {
                reply(currencies);
            })
    }
}

export default new CurrencyController();
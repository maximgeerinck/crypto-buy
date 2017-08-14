import * as Boom from "boom";
import * as Hapi from "hapi";
import Currency from "../models/Currency";
import NotFoundException from "../services/NotFoundException";

class CurrencyController {
    public latest(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        Currency.findOne()
            .sort({ _id: -1 })
            .then((currency: any) => {
                if (!currency) {
                    throw new NotFoundException(`Could not find currency`);
                }

                const output: any = {};
                output.createdOn = currency.created_on;
                output.base = currency.base;
                output.rates = currency.rates;

                reply(output);
            })
            .catch((err) => {
                if (err instanceof NotFoundException) {
                    reply(Boom.badRequest(err.message));
                }
                reply(Boom.badRequest());
            });
    }
}

export default new CurrencyController();

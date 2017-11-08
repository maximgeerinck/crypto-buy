import * as Boom from "boom";
import * as Hapi from "hapi";
import Currency from "../models/Currency";
import NotFoundException from "../services/NotFoundException";

import CurrencyRepository from "../currency/CurrencyRepository";

class CurrencyController {
    public async latest(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        try {

            const currencies = await CurrencyRepository.findLatest();
            return reply(currencies);

        } catch (err) {
            if (err instanceof NotFoundException) {
                return reply(Boom.badRequest(err.message));
            }
            return reply(Boom.badRequest());
        }
    }
}

export default new CurrencyController();

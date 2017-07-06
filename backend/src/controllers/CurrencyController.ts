import Currency from '../models/Currency';
import * as Hapi from 'hapi';
import * as Boom from 'boom';


class CurrencyController {
  latest(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    Currency.findOne().sort({ _id: -1 }).then((currency: any) => {

      if (!currency) throw 'E_NOT_FOUND';

      let output: any = {};
      output.createdOn = currency.created_on;
      output.base = currency.base;
      output.rates = currency.rates;

      reply(output);
    })
      .catch(err => {
        if (err === 'E_NOT_FOUND') {
          reply(Boom.badRequest(err));
        }
        console.log(err);
        reply(Boom.badRequest());
      })
  }
}

export default new CurrencyController();

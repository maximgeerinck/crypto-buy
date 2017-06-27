import Currency from '../models/Currency';
import User from '../models/user';
import * as Hapi from 'hapi';

class CurrencyController {
  all(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    const limit = req.params.limit;

    Currency.find({})
      .select('currencies.id currencies.name currencies.symbol currencies.price.usd currencies.change')
      .sort({ created_on: -1 })
      .limit(parseInt(limit))
      .then(currencies => {
        reply(currencies);
      });
  }

  details(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    const { coins } = req.payload;

    // get current
    Currency.find({ 'currencies.symbol': 'ETH' })
      .select('created_on currencies.name currencies.symbol currencies.change currencies.price.usd')
      .sort({ created_on: -1 })
      .limit(1)
      .then(details => {
        const d = details.map((detail: any) => {
          detail.currencies = detail.currencies.filter((currency: any) => {
            return ~coins.indexOf(currency.symbol); // will go to false/true
          });
        });

        reply(details);
      });

    //TODO: get from begin of tracking for the total amount!
  }

  load(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    User.findOne({ email: 'geerinck.maxim@gmail.com' }).select('portfolio').then((user: any) => {
      // group
      let group: any = {};

      for (let i = 0; i < user.portfolio.length; i++) {
        let amount = user.portfolio[i].amount;
        if (group[user.portfolio[i].currency]) {
          amount = amount + group[user.portfolio[i].currency].amount;
        }

        group[user.portfolio[i].currency] = {
          currency: user.portfolio[i].currency,
          amount: amount
        };
      }

      let output: any = [];
      for (let key in group) {
        output.push(group[key]);
      }

      reply(output);
    });
  }
}

export default new CurrencyController();

import Coin from '../models/Coin';
import User from '../models/user';
import * as Hapi from 'hapi';

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
      .select('coins.id coins.name coins.symbol coins.price.usd coins.change')
      .sort({ created_on: -1 })
      .limit(parseInt(limit))
      .then(coins => {
        reply(coins);
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

    Coin.find({})
      .select('coins.id coins.name coins.symbol coins.rank coins._id coins.change coins.price.usd')
      .sort({ _id: -1 })
      .limit(1)
      .then((details: any) => {
        let result = details[0].coins.filter((detail: any) => {
          return ~coins.indexOf(detail.symbol); // will go to false/true
        });

        reply(result);
      });
  }
}

export default new CoinController();

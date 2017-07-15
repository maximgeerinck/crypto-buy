import * as request from 'superagent';
import * as schedule from 'node-schedule';
import * as moment from 'moment';
import Currency from '../models/Currency';

// to support
// http://coinmarketcap.com/currencies/ripple/#charts
// http://coinmarketcap.com/currencies/btc/#charts
// http://coinmarketcap.com/currencies/eth/#charts
// more ? http://coinmarketcap.com/currencies/

const CURRENCY_API = 'https://openexchangerates.org/api/';
const CURRENCY_ENDPOINT = CURRENCY_API + 'latest.json?app_id=988c468f153641aea65dde82660085cd';

export const fetchCurrency = async () => {
    let data: any = await request.get(CURRENCY_ENDPOINT);
    const currencyObj = {
        base: data.body.base,
        rates: data.body.rates,
        source: 'openexchangerates.org'
    };
    let currency = new Currency(currencyObj);
    currency.save().catch((err) => console.log(err));
};

class CurrencyTask {
    start() {
        schedule.scheduleJob('0 12 * * *', () => {
            console.log(`${moment.now()}: fetching latest currency rates...`);
            fetchCurrency();
        });
    }
}

export default CurrencyTask;

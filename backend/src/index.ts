import mongoose from './db';
import * as request from 'superagent';
import * as schedule from 'node-schedule';
import * as moment from 'moment';
import Currency from './models/Currency';

import {createServer} from './server';

// to support
// http://coinmarketcap.com/currencies/ripple/#charts
// http://coinmarketcap.com/currencies/btc/#charts
// http://coinmarketcap.com/currencies/eth/#charts
// more ? http://coinmarketcap.com/currencies/

// connect mongodb
const URI = 'mongodb://mongo/crypto_buy';
mongoose.connect(URI);

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const API = "https://api.coinmarketcap.com/v1/";
const ETH_ENDPOINT = API + "/ticker";

const fetchPrice = async () => {
    const data = await request.get(ETH_ENDPOINT);

    //save response
    let currencies = [];
    for(let key in data.body) {
        currencies.push({
            id: data.body[key].id,
            name: data.body[key].name,
            symbol: data.body[key].symbol,
            rank: data.body[key].rank,
            price: {
                usd: data.body[key].price_usd,
                btc: data.body[key].price_btc
            },
            market_cap: {
                usd: data.body[key].market_cap_usd
            },
            supply: {
                available: data.body[key].available_supply,
                total: data.body[key].total_supply
            },
            change: {
                percent_1h: data.body[key].percent_change_1h,
                percent_24h: data.body[key].percent_change_24h,
                percent_7d: data.body[key].percent_change_7d
            },
            timestamp: data.body[key].timestamp
        })
    }
    var currency = new Currency({currencies: currencies});
    currency.save();
};

// execute every 1min
const cronFetchPrice = schedule.scheduleJob('*/1 * * * *', () => {
    console.log(`${moment.now()}: fetching...`);
    fetchPrice(); 
});

createServer(5000, '0.0.0.0').then(server => {
    server.start((err) => {
        if(err) throw err;
        console.log('Server running at: ', server.info.uri);
    });
});
import mongoose from './db';
import * as request from 'superagent';
import * as schedule from 'node-schedule';
import * as moment from 'moment';
import ETH from './models/eth';

// to support
// http://coinmarketcap.com/currencies/ripple/#charts
// http://coinmarketcap.com/currencies/btc/#charts
// http://coinmarketcap.com/currencies/eth/#charts
// more ? http://coinmarketcap.com/currencies/

// connect mongodb
const URI = 'mongodb://mongo/crypto_buy';
mongoose.connect(URI);

// get data
const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const ETH_ENDPOINT = API + "/eth";

const fetchPrice = async () => {
    const data = await request.get(ETH_ENDPOINT);

    //save response
    var eth = new ETH(data.body);
    eth.save();
};

// execute every 5min
const cronFetchPrice = schedule.scheduleJob('*/5 * * * *', () => {
    console.log(`${moment.now()}: fetching...`);
    fetchPrice();
});
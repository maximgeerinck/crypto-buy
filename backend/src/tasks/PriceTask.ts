import * as request from 'superagent';
import * as schedule from 'node-schedule';
import * as moment from 'moment';
import Coin from '../models/Coin';

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const API = 'https://api.coinmarketcap.com/v1/';
const ETH_ENDPOINT = API + '/ticker';

export const fetchPrice = async () => {
    const data = await request.get(ETH_ENDPOINT);

    //save response
    let coins = [];
    for (let key in data.body) {
        coins.push({
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
        });
    }
    var coin = new Coin({ coins: coins });
    coin.save();
};

class PriceTask {
    start() {
        // execute every 1min
        schedule.scheduleJob('*/1 * * * *', () => {
            console.log(`${moment.now()}: fetching...`);
            fetchPrice();
        });
    }
}

export default PriceTask;
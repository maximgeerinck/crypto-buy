import * as moment from "moment";
import * as schedule from "node-schedule";
import * as request from "superagent";

import { IMarketCoins, Market } from "../market/Market";
import { MarketCollection } from "../market/MarketCollection";
import MarketCollectionRepository from "../market/MarketCollectionRepository";

// get data
// const API = "https://coinmarketcap-nexuist.rhcloud.com/api";
const API = "https://min-api.cryptocompare.com/data";
const ALL_EXCHANGES = API + "/all/exchanges";

interface IMarketData {
    // market: coinNames:string[]
    [marketName: string]: IMarketCoins;
}

// get the markets and pairs
export const fetchMarketInfo = async () => {
    request
        .get(ALL_EXCHANGES)
        .then((response: any) => {

            const data: IMarketData = response.body;

            const markets = Object.keys(data).map((marketName: string) => {
                return new Market(marketName, data[marketName]);
            });

            const marketCollection = new MarketCollection(markets);

            // save
            MarketCollectionRepository.create(marketCollection);
        });
};

class MarketTask {
    public start() {
        // start up fetch
        fetchMarketInfo();
        // execute every day at midnight
        schedule.scheduleJob("0 0 */1 * *", () => {
            // console.log(`${moment.now()}: fetching...`);
            fetchMarketInfo();
        });
    }
}

export default MarketTask;

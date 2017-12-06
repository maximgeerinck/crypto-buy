/// <reference path="./index.d.ts" />
import * as crypto from "crypto";
import * as math from "mathjs";
import * as querystring from "querystring";
import * as request from "request-promise";

const API_KEY = "43e231774c8444e5966ebd7bc3f48775";
const API_SECRET = "d12554054ec04c2f8fe9754f35ff60dc";

const BASE_URL = "https://bittrex.com/api/v1.1";

export interface IBalance {
    Currency: string;
    Balance: number;
    Available: number;
    Pending: number;
    CryptoAddress?: string;
}

export interface IResponse {
    success: boolean;
    message: string;
    result: any;
}

class BittrexExchange {

    constructor(readonly apiKey: string, readonly apiSecret: string) {

    }

    public withCredentials(path: string) {
        const apiKey = this.apiKey;
        const nonce = new Date().getTime();

        const query = querystring.stringify({ apiKey, nonce });
        const uri = `${BASE_URL}/${path}?${query}`;

        return request({
            url: uri,
            headers: {
                apisign: crypto.createHmac("sha512", this.apiSecret).update(uri).digest("hex")
            }
        });
    }

    public async balance() {
        const response = await this.withCredentials(`account/getbalances`);
        const result = JSON.parse(response).result;
        return result;
    }

    // UNDER INVESTIGATION
    // Bittrex doesnt give data older than a month
    public async balanceByTradeHistory() {

        const history = await this.orderHistory();

        // group them by exchange
        const map: any = {};
        const costMap: any = {};
        history.forEach((trade: any) => {
            map[trade.Exchange] = map[trade.Exchange] ? map[trade.Exchange].concat(trade) : [].concat(trade);
        });

        // start grouping and counting
        Object.keys(map).forEach((pair) => {

            const cost = map[pair].reduce((obj: any, trade: any) => {
                const quantity = math.subtract(math.bignumber(trade.Quantity), math.bignumber(trade.QuantityRemaining));
                if (trade.OrderType === "LIMIT_BUY") {
                    // buy
                    // obj.price = (trade.Quantity * trade.PricePerUnit + obj.amount * obj.price)
                    //     / (trade.Quantity + obj.amount);

                    obj.amount = math.add(obj.amount, quantity);
                } else {
                    obj.amount = math.subtract(obj.amount, quantity);
                }

                return obj;

            }, { amount: math.bignumber(0), price: math.bignumber(0) });

            costMap[pair] = { amount: cost.amount.toString(), price: cost.price.toString() };
        });

        return costMap;
    }

    public async orderHistory() {
        const response = await this.withCredentials("account/getorderhistory");
        const result = JSON.parse(response).result;
        return result;
    }
}

export default BittrexExchange;

/// <reference path="./index.d.ts" />
import * as crypto from "crypto";
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
        console.log(response);
        const result = JSON.parse(response).result;
        return result;
    }

    public async orderHistory() {
        const response = await this.withCredentials("account/getorderhistory");
        const result = JSON.parse(response).result;
        return result;
    }
}

export default BittrexExchange;

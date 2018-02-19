import * as bluebird from "bluebird";
import * as flatten from "flat";
import * as moment from "moment";
import * as redis from "redis";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient({ host: "redis", port: 6379 }) as any;

export const cache = (key: string, obj: any, expiration: number = 60) => {
    if (!key || !obj || !expiration) {
        console.log(`All args should be set`);
        console.log(`key: ${key}`);
        console.log(`obj: ${obj}`);
        console.log(`Expiration: ${expiration}`);
        return;
    }
    client.setex(key, expiration, JSON.stringify(obj));
};

export const get = (key: string): Promise<any> => {
    // return client.get(key)
    //     .then((result: any) => {
    //         console.log("GOT RESULT");
    //         console.log(result);
    //         return JSON.parse(result);
    //     });
    return new Promise((resolve, reject) => {
        client.get(key, (err: any, result: any) => {
            if (err) {
                return reject(err);
            }

            if (result) {
                return resolve(JSON.parse(result));
            }
            return resolve(false);
        });
    });
};

export const invalidate = (key: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        client.del(key, (err: any, response: any) => {
            if (!err) {
                return resolve(true);
            }
            return reject(err);
        });
    });
};

export const MIN = 60;
export const TEN_MIN = 60 * 10;
export const HOUR = 3600;

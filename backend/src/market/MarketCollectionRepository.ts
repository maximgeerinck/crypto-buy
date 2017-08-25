import * as bluebird from "bluebird";
import * as flatten from "flat";
import * as moment from "moment";
import * as redis from "redis";
import mongoose from "../db";
import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
import { IRepositoryAdapter, MongoRepository } from "../services/repository";
import MarketCollectionModel, { MarketCollection } from "./MarketCollection";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient({ host: "redis", port: 6379 }) as any;

// interface IMarketColletionRepository {

// }

class MarketCollectionRepository extends MongoRepository<MarketCollection> {
    constructor() {
        super(MarketCollectionModel, "MarketCollection");
    }

}

export default new MarketCollectionRepository();

import { Document, Schema } from "mongoose";
import mongoose from "../db";
import AbstractModel from "../models/AbstractModel";
import { IMarket, IMarketDAO, Market, MarketSchema } from "./Market";

interface IMarketCollection {
    markets: Market[];
    createdOn: Date;
    updatedOn: Date;
}

interface IMarketCollectionDAO {
    markets: IMarketDAO[];
    created_on: Date;
    updated_on: Date;
}

export class MarketCollection extends AbstractModel implements IMarketCollection {

    public static parse(dao: IMarketCollectionDAO): MarketCollection {

        const markets = dao.markets.map((market: IMarketDAO) => {
            return new Market(market.name);
        });

        const obj = new MarketCollection(markets, dao.created_on, dao.updated_on);
        return obj;
    }

    public markets: Market[];

    constructor(
        markets: Market[] = [],
        readonly createdOn: Date = new Date(),
        readonly updatedOn: Date = new Date()) {
        super();
        this.markets = markets;
    }

    public toDAO() {
        return {
            markets: this.markets.map((market: Market) => market.toDAO()),
            created_on: this.createdOn,
            updated_on: this.updatedOn
        } as IMarketCollectionDAO;
    }
}

export const MarketCollectionSchema = new Schema({
      markets: [MarketSchema]
    },
    { timestamps: { createdAt: "created_on", updatedAt: "updated_on" }, strict: false }
  );

export default mongoose.model("MarketCollection", MarketCollectionSchema);

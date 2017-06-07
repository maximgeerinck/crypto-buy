import mongoose from '../db';
import { Document, Schema } from 'mongoose';

export const CurrencySchema = new Schema({
    currencies: [new Schema({
        id: { type: String },
        name: { type: String },
        symbol: { type: String },
        rank: { type: Number },
        price: {
            usd: { type: Number },
            btc: { type: Number }
        },
        market_cap: {
            usd: { type: Number }
        },
        supply: {
            available: { type: Number },
            total: { type: Number }
        },
        change: {
            percent_1h: { type: Number },
            percent_24h: { type: Number },
            percent_7d: { type: Number }
        },
        timestamp: { type: Number }
    }, {strict: false})],    
}, { timestamps: {createdAt: 'created_on', updatedAt: 'updated_on'}, strict: false });

export default mongoose.model('Currency', CurrencySchema);
import mongoose from '../db';
import { Document, Schema } from 'mongoose';

export const ETHSchema = new Schema({
    symbol: { type: String },
    position: { type: String },
    name: { type: String },
    market_cap: {
        usd: { type: Number },
        eur: { type: Number },
        cny: { type: Number },
        gbp: { type: Number },
        cad: { type: Number },
        rub: { type: Number },
        hkd: { type: Number },
        jpy: { type: Number },
        aud: { type: Number },
        brl: { type: Number },
        inr: { type: Number },
        krw: { type: Number },
        mxn: { type: Number },
        idr: { type: Number },
        chf: { type: Number },
        btc: { type: Number }
    },
    supply: { type: String },
    volume: {
        usd: { type: Number },
        eur: { type: Number },
        cny: { type: Number },
        gbp: { type: Number },
        cad: { type: Number },
        rub: { type: Number },
        hkd: { type: Number },
        jpy: { type: Number },
        aud: { type: Number },
        brl: { type: Number },
        inr: { type: Number },
        krw: { type: Number },
        mxn: { type: Number },
        idr: { type: Number },
        chf: { type: Number },
        btc: { type: Number }
    },
    price: {
        usd: { type: Number },
        eur: { type: Number },
        cny: { type: Number },
        gbp: { type: Number },
        cad: { type: Number },
        rub: { type: Number },
        hkd: { type: Number },
        jpy: { type: Number },
        aud: { type: Number },
        brl: { type: Number },
        inr: { type: Number },
        krw: { type: Number },
        mxn: { type: Number },
        idr: { type: Number },
        chf: { type: Number },
        btc: { type: Number }
    },
    change: { type: String },
    timestamp: { type: String }
}, { timestamps: {createdAt: 'created_on', updatedAt: 'updated_on'} });

export default mongoose.model('ETH', ETHSchema);
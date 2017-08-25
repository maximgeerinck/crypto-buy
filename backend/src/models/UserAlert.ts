import mongoose from "../db";
import AbstractModel from "./AbstractModel";

enum IUserAlertType {
    ALERT_COIN,
    COIN_PRICE,
    COIN_PERCENTAGE
}

// When value is above X CURRENCY or below X CURRENCY on MARKET
// when percentage ....
export interface IUserAlert {
    type: IUserAlertType;
    threshold: {
        up: number,
        down: number
    };
    market: string;
    currency?: string;
    createdOn: Date;
    updatedOn: Date;
}

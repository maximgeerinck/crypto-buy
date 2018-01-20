import * as Joi from "joi";
import CoinController from "../coin/CoinController";

module.exports = [
    {
        method: "GET",
        path: "/coins/{limit}",
        handler: CoinController.all,
        config: { auth: false }
    },
    {
        method: "POST",
        path: "/coin/details",
        handler: CoinController.details,
        config: { auth: false }
    },
    {
        method: "POST",
        path: "/coin/details/increment",
        handler: CoinController.detailsIncrement,
        config: { auth: false }
    },
    {
        method: "POST",
        path: "/coin/stats/weekly",
        handler: CoinController.stats,
        config: {
            auth: false,
            validate: {
                payload: {
                    coins: Joi.array().items(Joi.string())
                }
            }
        }
    }
];

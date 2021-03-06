import * as Joi from "joi";
import PortfolioController from "../controllers/PortfolioController";

const coin = Joi.object().keys({
    coinId: Joi.string().required(),
    amount: Joi.number().required(),
    source: Joi.string(),
    boughtPrice: Joi.number(),
    currency: Joi.string(),
    boughtAt: Joi.date()
});

module.exports = [
    {
        method: "GET",
        path: "/portfolio/load",
        handler: PortfolioController.index
    },
    {
        method: "POST",
        path: "/portfolio/coins/add",
        handler: PortfolioController.addCoins,
        config: {
            validate: {
                payload: Joi.array().items(coin)
            }
        }
    },
    {
        method: "POST",
        path: "/portfolio/coin/update",
        handler: PortfolioController.updateCoin,
        config: {
            validate: {
                payload: {
                    id: Joi.string().required(),
                    coinId: Joi.string().required(),
                    amount: Joi.number().required(),
                    boughtPrice: Joi.number().default(0),
                    currency: Joi.string(),
                    source: Joi.string(),
                    boughtAt: Joi.date(),
                    automatic: Joi.bool()
                }
            }
        }
    },
    {
        method: "POST",
        path: "/portfolio/coin/remove",
        handler: PortfolioController.removeCoin
    }
];

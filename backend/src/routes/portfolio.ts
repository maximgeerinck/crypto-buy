import PortfolioController from "../controllers/PortfolioController";
import * as Joi from "joi";

const coin = Joi.object().keys({
    symbol: Joi.string().required(),
    amount: Joi.number().required(),
    source: Joi.string(),
    boughtPrice: Joi.number(),
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
                    id: Joi.string(),
                    symbol: Joi.string().required(),
                    amount: Joi.number().required(),
                    boughtPrice: Joi.number().default(0),
                    source: Joi.string(),
                    boughtAt: Joi.date()
                }
            }
        }
    },
    {
        method: "POST",
        path: "/portfolio/coin/remove",
        handler: PortfolioController.removeCoin
    },
    {
        method: "POST",
        path: "/portfolio/share",
        handler: PortfolioController.share
    },
    {
        method: "GET",
        path: "/portfolio/{token}",
        handler: PortfolioController.sharedPortfolio,
        config: { auth: false }
    }
];

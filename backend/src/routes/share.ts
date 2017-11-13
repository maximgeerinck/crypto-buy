import * as Joi from "joi";
import ShareController from "../controllers/ShareController";

const JoiSettings = Joi.object().keys({
    amount: Joi.boolean(),
    price: Joi.boolean(),
    graph: Joi.boolean(),
    change: Joi.boolean()
});
module.exports = [
    {
        method: "GET",
        path: "/share/{token}",
        handler: ShareController.retrieve,
        config: { auth: false }
    },
    {
        method: "DELETE",
        path: "/share/{id}",
        handler: ShareController.delete
    },
    {
        method: "GET",
        path: "/banner/{token}",
        handler: ShareController.banner,
        config: { auth: false }
    },
    {
        method: "POST",
        path: "/share",
        handler: ShareController.share,
        config: {
            validate: {
                payload: {
                    settings: JoiSettings,
                    currency: Joi.string()
                }
            }
        }
    }
];

import UserController from "../controllers/UserController";
const BaseJoi = require("joi");
import BittrexApiConstraint from "../validation/BittrexApiKeyConstraint";
import EmailInUseConstraint from "../validation/EmailInUseConstraint";

const Joi = BaseJoi.extend([EmailInUseConstraint, BittrexApiConstraint]);

const exchanges = Joi.object().keys({
    // bittrex:  Joi.bittrexApi()
    bittrex: Joi.object().keys({
        apiSecret: Joi.string(),
        apiKey: Joi.string()
    })
});

module.exports = [
    {
        method: "POST",
        path: "/user/create",
        handler: UserController.create,
        config: {
            auth: false,
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required()
                }
            }
        }
    },
    {
        method: "GET",
        path: "/user/me",
        handler: UserController.me
    },
    {
        method: "POST",
        path: "/user/update",
        handler: UserController.update
    },
    {
        method: "POST",
        path: "/user/preferences/update",
        handler: UserController.updatePreferences,
        config: {
            validate: {
                payload: {
                    currency: Joi.string(),
                    initialInvestment: Joi.number(),
                    exchanges
                }
            }
        }
    },
    {
        method: "POST",
        path: "/user/password",
        handler: UserController.changePassword,
        config: {
            validate: {
                payload: {
                    currentPassword: Joi.string().required(),
                    newPassword: Joi.string().required()
                }
            }
        }
    }
];

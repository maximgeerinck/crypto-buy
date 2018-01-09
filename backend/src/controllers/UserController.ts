import * as Boom from "boom";
import * as Hapi from "hapi";
import { MongoError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { IUser, User } from "../models/user";
import BittrexExchange from "../portfolio/exchange/bittrex";
import UserRepository from "../services/UserRepository";
import UserService from "../services/UserService";
import { comparePassword } from "../utils/cypher-util";
import Validator, { ValidationError } from "../validation/Validator";
// interface ICreateValidationErrors {
//     email?: string,
//     password?: string,
//     domains?: Array<string>
// }

interface IMongooseError extends MongooseError {
    errors: any;
}

class UserController {
    public create(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { email, password, domains } = req.payload;

        // TODO: Extract different validation methods
        const validator = new Validator();
        UserService.createUser(email, password)
            .then((user: any) => {
                console.log(`[Registration] ${user.email} registered`);
                return reply(user);
            })
            .catch((err) => {
                const validationErrors: any = {};

                if (err instanceof MongoError) {
                    if (err.message.indexOf("duplicate key") > -1)
                        validator.addError(new ValidationError("email", "email.inUse"));
                } else if (err.name === "ValidationError") {
                    for (const field in err.errors) {
                        const f = field.split("."); // for array validation
                        validator.addError(new ValidationError(f[0], err.errors[field].message));
                    }
                } else {
                    console.log(err);
                }
                return validator.isValid() ? reply(Boom.badRequest()) : reply(validator.generateBadRequest());
            });
    }

    public update(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { user } = req.payload;
        const userObj = User.parse(user);

        UserService.update(userObj).then((user) => reply(user)).catch((err) => reply(Boom.badRequest()));
    }

    public me(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: User = req.auth.credentials;
        delete user.credentials;

        reply(user);
    }

    public async updatePreferences(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const preferences = req.payload;
        const validator = new Validator();

        const user = req.auth.credentials;
        if (JSON.stringify(user.preferences) !== JSON.stringify(preferences)) {
            const bittrexExchange = new BittrexExchange(
                preferences.exchanges.bittrex.apiKey, preferences.exchanges.bittrex.apiSecret);
            const validSettings = await bittrexExchange.validateSettings();

            if (!validSettings) {
                validator.addError(new ValidationError("exchanges.bittrex", "string.invalid"));
                return reply(validator.generateBadRequest());
            }
        }

        Object.assign(user.preferences, preferences);

        try {
            const newUser = await UserService.update(user);
            return reply(user);
        } catch (err) {
            console.log("bad request");
            console.log(err);
            return reply(Boom.badRequest());
        }
    }

    public changePassword(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { currentPassword, newPassword } = req.payload;

        // verify if user his password is correct
        const user = req.auth.credentials;
        const validator = new Validator();

        comparePassword(currentPassword, user.credentials[user.credentials.length - 1].password)
            .then((correct) => {
                if (!correct) {
                    // not correct
                    validator.addError(new ValidationError("currentPassword", "string.password_incorrect"));
                    throw new Error("E_VALIDATION");
                }
                return UserService.addCredentials(req.auth.credentials, newPassword);
            })
            .then(() => {
                return reply({ success: true });
            })
            .catch((err) => {
                return reply(validator.generateBadRequest());
            });
    }
}

export default new UserController();

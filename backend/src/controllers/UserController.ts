import * as Boom from "boom";
import * as Hapi from "hapi";
import { MongoError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { IUser, User } from "../models/user";
import UserRepository from "../services/UserRepository";
import UserService from "../services/UserService";
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
        UserService.createUser(email, password).then(reply).catch((err) => {
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

    public updatePreferences(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const preferences = req.payload;

        const user = req.auth.credentials;
        Object.assign(user.preferences, preferences);

        UserService.update(user).then((user) => reply(user)).catch((err) => reply(Boom.badRequest()));
    }
}

export default new UserController();

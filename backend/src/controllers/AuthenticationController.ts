import * as Boom from "boom";
import * as Hapi from "hapi";
import * as JWT from "jsonwebtoken";
import config from "../config";
import { IUser, User } from "../models/user";
import UserService from "../services/UserService";
import * as CypherUtil from "../utils/cypher-util";
import { sendMail } from "../utils/EmailHelper";

interface IForgotPasswordRequest extends Request {
    payload: {
        email: string; // the email to request
    };
}

interface IResetPasswordRequest extends Request {
    payload: {
        token: string; // the token received in the email to reset
        email: string; // the email of the account to reset
        password: string; // new password
    };
}

class AuthenticationController {
    public authenticate(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const { email, password } = req.payload;

        // search some credentials
        UserService.verifyUser(email, password)
            .then((user) => {
                const obj: object = { user };

                if (!user) {
                    return reply(Boom.unauthorized("E_INVALID_CREDENTIALS"));
                }
                const token = JWT.sign(obj, config.authentication.jwt.secret);
                return reply({ token });
            })
            .catch((err) => {
                return reply(Boom.unauthorized("E_INVALID_CREDENTIALS"));
            });
    }

    public forgotPassword(req: IForgotPasswordRequest, reply: Hapi.ReplyNoContinue) {
        const { email } = req.payload;

        UserService.requestToken(email)
            .then((token) => {
                // send mail with token
                return sendMail(
                    [ email ],
                    "Forgot password",
                    `Please visit <a href="https://cryptotrackr.com/reset/${email}/${token}">http://cryptotrackr.com/reset/${email}/${token}</a> to reset your password!`
                );
            })
            .then(() => {
                reply({ success: true });
            })
            .catch((err) => {
                console.log(err);
                reply({ success: false });
            });
    }
    public resetPassword(req: IResetPasswordRequest, reply: Hapi.ReplyNoContinue) {
        const { token, email, password } = req.payload;

        UserService.findOneByEmailAndToken(email, token)
            .then((user) => {
                return UserService.addCredentials(user, password);
            })
            .then((user) => {
                return reply({ success: true });
            })
            .catch((err) => {
                console.log(err);
                return reply({ success: false });
            });
    }
}
export default new AuthenticationController();

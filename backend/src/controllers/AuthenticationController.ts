import * as JWT from 'jsonwebtoken';
import * as Hapi from 'hapi';
import UserService from '../services/UserService';
import { IUser, User } from '../models/user';
import * as Boom from 'boom';
import config from '../config';
import * as CypherUtil from '../utils/cypher-util';
import { sendMail } from '../utils/EmailHelper';

interface ForgotPasswordRequest extends Request {
  payload: {
    email: string; // the email to request
  };
}

interface ResetPasswordRequest extends Request {
  payload: {
    token: string; // the token received in the email to reset
    email: string; // the email of the account to reset
    password: string; // new password
  };
}

class AuthenticationController {
  authenticate(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
    const { email, password } = req.payload;

    // search some credentials
    UserService.verifyUser(email, password)
      .then(user => {
        let obj: object = { user: user };

        if (!user) return reply(Boom.unauthorized('E_INVALID_CREDENTIALS'));
        let token = JWT.sign(obj, config.authentication.jwt.secret);
        return reply({ token: token });
      })
      .catch(err => {
        return reply(Boom.unauthorized('E_INVALID_CREDENTIALS'));
      });
  }

  forgotPassword(req: ForgotPasswordRequest, reply: Hapi.ReplyNoContinue) {
    const { email } = req.payload;

    UserService.requestToken(email)
      .then(token => {
        // send mail with token
        sendMail(
          [email],
          'Forgot password',
          `Please visit <a href="http://wallstilldawn.com/reset/${email}/${token}">http://wallstilldawn.com/reset/${email}/${token}</a> to reset your password!`
        );
        reply({ success: true });
      })
      .catch(err => {
        console.log(err);
        reply({ success: false });
      });
  }
  resetPassword(req: ResetPasswordRequest, reply: Hapi.ReplyNoContinue) {
    const { token, email, password } = req.payload;

    UserService.findOneByEmailAndToken(email, token)
      .then(user => {
        return UserService.addCredentials(user, password);
      })
      .then(user => {
        return reply({ success: true });
      })
      .catch(err => {
        console.log(err);
        return reply({ success: false });
      });
  }
}
export default new AuthenticationController();

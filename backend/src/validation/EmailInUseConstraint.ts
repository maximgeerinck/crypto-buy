import * as Joi from 'joi';
import UserService from '../services/UserService';

export default {
  name: 'emailInUse',

  base: Joi.string().email(),

  language: {
    emailInUse: 'must be not in use yet'
  },

  coerce(value: string, state: any, options: any) {
    if (!value) {
      return value;
    }

    UserService.findUserByEmail(value)
      .then(user => {
        console.log("found");
        if (user) return this.createError('email.emailInUse', { value }, state, options);
        return value;
      })
      .catch(err => {
        return this.createError('email.emailInUse', { value }, state, options);
      });
  },

  rules: [
    {
      name: 'emailInUse',
      description: 'Should be a non used email',
      params: {},
      setup(params: any) {
        this._flags.emailInUse = true;
      },
      validate(params: any, value: any, state: any, options: any) {
        // No-op just to enable description
        return value;
      }
    }
  ]
};

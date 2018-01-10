// console.log(preferences);
//         if (JSON.stringify(user.preferences) !== JSON.stringify(preferences)
//             && preferences.exchanges && preferences.exchanges.bittrex
//             && preferences.exchanges.bittrex.apiKey.trim() !== "" && preferences.exchanges.bittrex.apiSecret.trim() !== "") {
//             const bittrexExchange = new BittrexExchange(
//                 preferences.exchanges.bittrex.apiKey, preferences.exchanges.bittrex.apiSecret);
//             const validSettings = await bittrexExchange.validateSettings();

//             if (!validSettings) {
//                 validator.addError(new ValidationError("exchanges.bittrex", "string.invalid"));
//                 return reply(validator.generateBadRequest());
//             }
//         }
import * as Joi from "joi";
import BittrexExchange from "../portfolio/exchange/bittrex";
import UserService from "../services/UserService";

interface IBittrexApi {
    apiKey: string;
    apiSecret: string;
}

export default {
  name: "bittrexApi",
  base: Joi.object().keys({
    apiKey: Joi.string(),
    apiSecret: Joi.string()
  }),
  language: {
    bittrexApi: "Is not a valid api key / secret combination"
  },

  coerce(bittrexApiObject: IBittrexApi, state: any, options: any) {
    if (!bittrexApiObject || !bittrexApiObject.apiKey || !bittrexApiObject.apiSecret) {
        return bittrexApiObject;
    }
    const bittrexExchange = new BittrexExchange(bittrexApiObject.apiKey, bittrexApiObject.apiSecret);
    bittrexExchange.validateSettings().then((valid) => {
        return valid
          ? bittrexApiObject
          : this.createError("bittrexApi.invalid", { bittrexApiObject }, state, options);
    });
  },

  rules: [
    {
      name: "bittrexApi",
      description: "Should be a valid api key",
      params: {},
      setup(params: any) {
        this._flags.bittrexApi = true;
      },
      validate(params: any, bittrexApiObject: IBittrexApi, state: any, options: any) {
        return bittrexApiObject;
      }
    }
  ]
};

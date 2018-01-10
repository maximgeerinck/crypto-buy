import BittrexExchange from "../portfolio/exchange/bittrex";
import UserService from "../services/UserService";
import ValidationConstraint from "./ValidationConstraint";
import ValidationError from "./ValidationError";

interface IBittrexApi {
    apiKey: string;
    apiSecret: string;
}

class BittrexApiConstraint extends ValidationConstraint {
  constructor(readonly apiKey: string, readonly apiSecret: string) {
    super();
  }

  public message() {
    return "api.invalid";
  }

  public async validate() {
    if (!this.apiKey && !this.apiSecret) {
      return this.valid();
    }

    if (!this.apiKey) {
      return new ValidationError("exchanges.bittrex.apiKey", this.message());
    }

    if (!this.apiSecret) {
      return new ValidationError("exchanges.bittrex.apiKey", this.message());
    }

    const bittrexExchange = new BittrexExchange(this.apiKey, this.apiSecret);
    const valid = await bittrexExchange.validateSettings();
    if (!valid) {
      return new ValidationError("exchanges.bittrex", this.message());
    }
    return this.valid();
  }
}

export default BittrexApiConstraint;

// export default {
//   name: "bittrexApi",
//   base: Joi.object().keys({
//     apiKey: Joi.string(),
//     apiSecret: Joi.string()
//   }),
//   language: {
//     bittrexApi: "Is not a valid api key / secret combination"
//   },

//   coerce(bittrexApiObject: IBittrexApi, state: any, options: any) {
//     if (!bittrexApiObject || !bittrexApiObject.apiKey || !bittrexApiObject.apiSecret) {
//         return bittrexApiObject;
//     }
//     const bittrexExchange = new BittrexExchange(bittrexApiObject.apiKey, bittrexApiObject.apiSecret);
//     bittrexExchange.validateSettings().then((valid) => {
//       console.log(valid ? "yes" : "no");
//       return valid
//           ? bittrexApiObject
//           : this.createError("bittrexApi.invalid", { bittrexApiObject }, state, options);
//     })
//     .catch((err) => {
//       this.createError("bittrexApi.invalid", { bittrexApiObject }, state, options);
//     });
//   },

//   rules: [
//     {
//       name: "bittrexApi",
//       description: "Should be a valid api key",
//       params: {},
//       setup(params: any) {
//         this._flags.bittrexApi = true;
//       },
//       validate(params: any, bittrexApiObject: IBittrexApi, state: any, options: any) {
//         return bittrexApiObject;
//       }
//     }
//   ]
// };

import * as Boom from "boom";
import * as Hapi from "hapi";
import Currency from "../models/Currency";
import NotFoundException from "../services/NotFoundException";
import CurrencyMap from "./CurrencyMap";

class CurrencyRepository {
    public findLatest() {
        return Currency.findOne()
            .sort({ _id: -1 })
            .then((currency: any) => {
                if (!currency) {
                    throw new NotFoundException(`Could not find currency`);
                }

                const output: any = {};
                output.createdOn = currency.created_on;
                output.base = currency.base;

                const currencies: any = {};

                Object.keys(currency.rates).forEach((abbr: string) => {
                    if (abbr && CurrencyMap[abbr]) {
                        currencies[abbr] = {
                            rate: currency.rates[abbr],
                            name: CurrencyMap[abbr].name,
                            symbolFormat: CurrencyMap[abbr].symbolFormat
                        };
                    }

                });

                output.currencies = currencies;

                return output;
            });
    }
}

export default new CurrencyRepository();

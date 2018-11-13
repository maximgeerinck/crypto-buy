import * as moment from "moment";
import CoinRepository from "../coin/CoinRepository";
import CurrencyRepository from "../currency/CurrencyRepository";
import UserModel from "../models/user";

class AnalyticsController {

    public async totalInvestedAmount() {
        const portfolioRecords: any = await this.allPortfolios();
        const currencyRates = await CurrencyRepository.findLatest();

        const totalAmount = portfolioRecords[0].portfolios.reduce(
            (prev: any, curr: any) => {
                let rate = 1;
                if (currencyRates.currencies[curr.currency]) {
                    rate = currencyRates.currencies[curr.currency].rate;
                }

                if (curr.bought_price) {
                    return prev + (curr.amount * curr.bought_price * rate);
                } else {
                    return prev;
                }

            }
            , 0);

        return totalAmount;
    }

    public async coinsBoughtToday() {
        const portfolioRecords: any = await this.allPortfolios({
            start: moment().startOf("day"),
            end: moment().endOf("day"),
            extra: [{
                $group: {
                    _id: "$portfolio.coin_id",
                    amountOfPeopleBought: { $sum: 1 },
                    amount: { $sum: "$portfolio.amount" }

                }
            },
            { $sort: { amountOfPeopleBought: -1 } }]
        });

        return portfolioRecords;
        // const coins: any = await CoinRepository.findAllToday();
    }

    private allPortfolios(params: any = {}) {

        const { start, end, extra } = params;

        const date = start && end ? [{ $match: { created_on: { $gte: start, $lt: end } } }] : [];
        const extraConditions = extra ? extra : [{
            $group: {
                _id: null,
                total_records: { $sum: 1 },
                portfolios: { $addToSet: "$portfolio" },
            }
        }];

        return UserModel.aggregate([
            ...date,
            { $project: { portfolio: 1, _id: 0 } },
            { $unwind: "$portfolio" },
            ...extraConditions
        ]);
    }
}

export default new AnalyticsController();

import * as math from "mathjs";
import CoinRepository from "../coin/CoinRepository";
import User, { User as DomainUser } from "../models/user";
import UserCoin from "../models/UserCoin";
import BittrexExchange from "../portfolio/exchange/bittrex";
import * as CacheHelper from "../utils/CacheHelper";
import * as PortfolioHelper from "../utils/PortfolioHelper";

export const key = (userId: any) => `portfolio/aggregate/${userId}`;

class PortfolioService {
    public async aggregatePortfolio(user: DomainUser): Promise<UserCoin[]> {
        const cacheResult = await CacheHelper.get(key(user.id));
        if (cacheResult) {
            return cacheResult;
        }
        const portfolio = user.portfolio;

        try {
            if (
                user.preferences.exchanges &&
                user.preferences.exchanges.bittrex &&
                user.preferences.exchanges.bittrex.apiKey &&
                user.preferences.exchanges.bittrex.apiSecret
            ) {
                const bittrexSettings = user.preferences.exchanges.bittrex;
                const bittrexExchange = new BittrexExchange(
                    bittrexSettings.apiKey,
                    bittrexSettings.apiSecret,
                );
                const balance = (await bittrexExchange.balance()) || [];

                for (const coin of balance) {
                    if (coin.Balance <= 0.000001) {
                        continue;
                    }

                    const coinDetails = await CoinRepository.findCoinTodayBySymbol(coin.Currency);

                    if (!coinDetails) {
                        console.log(`could not find ${coin.Currency}`);
                        continue;
                    }
                    portfolio.push(
                        new UserCoin(
                            coinDetails.coinId,
                            coin.Balance,
                            "bittrex.com",
                            0,
                            "BTC",
                            new Date(),
                            true,
                        ),
                    );
                }
            }
            CacheHelper.cache(key(user.id), portfolio, CacheHelper.TEN_MIN);
            return portfolio;
        } catch (ex) {
            if (ex.statusCode === 503) {
                console.log(
                    "[Bittrex] Service unavailable, most likely wrong api key " + ex.options.url,
                );
            } else {
                console.log(ex);
            }
            CacheHelper.cache(key(user.id), portfolio, CacheHelper.TEN_MIN);
            return portfolio;
        }
    }
}

export default new PortfolioService();

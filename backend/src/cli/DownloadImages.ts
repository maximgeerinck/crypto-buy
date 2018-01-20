import CoinRepository from "../coin/CoinRepository";
import * as CoinHelper from "../utils/CoinHelper";
import * as DownloadHelper from "../utils/DownloadHelper";
import * as ImageHelper from "../utils/ImageHelper";

CoinRepository.findAllWithHistory()
    .then((coins) => {

        const promises: any = [];

        Object.keys(coins).forEach((coin: any) => {
            promises.push(async () =>
                ImageHelper.downloadImage(CoinHelper.getCoinImage(coins[coin].coinId), coins[coin].coinId, "coins"));
        });

        console.log(`Downloading ${promises.length} images`);

        DownloadHelper.batch(promises, 10, 200);
    });

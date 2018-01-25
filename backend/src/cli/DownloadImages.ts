import CoinRepository from "../coin/CoinRepository";
import * as CoinHelper from "../utils/CoinHelper";
import * as DownloadHelper from "../utils/DownloadHelper";
import * as ImageHelper from "../utils/ImageHelper";

CoinRepository.findAllToday()
    .then((daos) => {

        const promises: any = [];

        daos.forEach((coin: any) => {
            promises.push(async () =>
                ImageHelper.downloadImage(CoinHelper.getCoinImage(coin.coinId), coin.coinId, "coins"));
        });

        console.log(`Downloading ${promises.length} images`);

        DownloadHelper.batch(promises, 10, 200);
    });

import CoinRepository from "../coin/CoinRepository";
import * as CoinHelper from "../utils/CoinHelper";
import * as DownloadHelper from "../utils/DownloadHelper";
import * as ImageHelper from "../utils/ImageHelper";

CoinRepository.findAllToday()
    .then((daos: any) => {
        const promises: any = [];

        daos.forEach((coin: any) => {
            promises.push(async () => {
                if (coin) {
                    return ImageHelper.downloadImage(
                        CoinHelper.getCoinImage(coin.coinId),
                        coin.coinId,
                        "coins",
                    );
                }
            });
        });

        console.log(`Downloading ${promises.length} images`);

        DownloadHelper.batch(promises, 10, 200);
    })
    .catch((ex: any) => {
        console.log(`could not download image`);
        console.log(ex);
    });

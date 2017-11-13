import AbstractTask from "./AbstractTask";
import CoinRepository from "../coin/CoinCollectionRepository";
import * as CoinHelper from "../utils/CoinHelper";
import * as DownloadHelper from "../utils/DownloadHelper";
import * as ImageHelper from "../utils/ImageHelper";

class CoinImageTask extends AbstractTask {
    public key: string = "coin-image-task";

    constructor() {
        super("coin-image-task");
    }

    public schedule() {
        super.scheduleJob("*/5 * * * *");
    }

    public execute() {
        return this.downloadImages();
    }

    public downloadImages() {
        return CoinRepository.findAllWithHistory()
            .then((coins) => {

                const promises: any = [];

                Object.keys(coins).forEach((coin: any) => {
                    promises.push(async () => ImageHelper.downloadImage(
                        CoinHelper.getCoinImage(coins[coin].coin_id), coins[coin].coin_id, "coins"));
                });

                console.log(`Downloading ${promises.length} images`);

                DownloadHelper.batch(promises, 10, 200);
            });

    }
}

export default CoinImageTask;
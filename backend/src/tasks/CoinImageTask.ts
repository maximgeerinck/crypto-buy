import CoinRepository from "../coin/CoinRepository";
import * as CoinHelper from "../utils/CoinHelper";
import * as DownloadHelper from "../utils/DownloadHelper";
import * as ImageHelper from "../utils/ImageHelper";
import AbstractTask from "./AbstractTask";

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
        return CoinRepository.findAllToday()
        .then((daos) => {

            const promises: any = [];

            daos.forEach((coin: any) => {
                promises.push(async () =>
                    ImageHelper.downloadImage(CoinHelper.getCoinImage(coin.coinId), coin.coinId, "coins"));
            });

            console.log(`Downloading ${promises.length} images`);

            DownloadHelper.batch(promises, 10, 200);
        });

    }
}

export default CoinImageTask;

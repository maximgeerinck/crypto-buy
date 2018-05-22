import * as request from "request-promise";
import CoinRepository from "../coin/CoinRepository";
import * as CoinHelper from "../utils/CoinHelper";
import * as DownloadHelper from "../utils/DownloadHelper";
import * as ImageHelper from "../utils/ImageHelper";

CoinRepository.findAllToday()
    .then(async (daos: any) => {
        const promises: any = [];

        // get info
        const listingsData = await request.get({ uri: "https://api.coinmarketcap.com/v2/listings/", json: true });
        const listings = listingsData.data.reduce((prev: any, curr: any) => {
            prev[curr.website_slug] = curr;
            return prev;
        }, {});

        daos.forEach((coin: any) => {
            promises.push(async () => {
                if (coin) {
                    return ImageHelper.downloadImage(
                        CoinHelper.getCoinImage(listings[coin.coinId.toLowerCase().replace(/[. ]/, "-")].id),
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

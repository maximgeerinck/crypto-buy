import AnalyticsController from "../analytics/AnalyticsController";
import mongoose, { URI } from "../db";

mongoose.connect(URI);

async function main() {
    const coins = await AnalyticsController.coinsBoughtToday();
    console.log(coins);
    process.exit(0);
}

try {
    main();
} catch (ex) {
    console.error(ex);
    process.exit(0);
}

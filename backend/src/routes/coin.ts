import CoinController from "../coin/CoinController";

module.exports = [
    {
        method: "GET",
        path: "/coins/{limit}",
        handler: CoinController.all,
        config: { auth: false }
    },
    {
        method: "POST",
        path: "/coin/details",
        handler: CoinController.details,
        config: { auth: false }
    }
];

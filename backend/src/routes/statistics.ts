import StatisticController from "../controllers/StatisticController";

module.exports = [
    {
        method: "POST",
        path: "/statistics",
        handler: StatisticController.index,
        config: { auth: false }
    }
];

import { DEVELOPMENT } from "./constants";
import mongoose, { URI } from "./db";
import { createServer } from "./server";
import CurrencyTask from "./tasks/CurrencyTask";
import MarketTask from "./tasks/MarketTask";
import PriceTask from "./tasks/PriceTask";
import ResetDemoTask from "./tasks/ResetDemoTask";

import CoinImageTask from "./tasks/CoinImageTask";
import TaskRepository from "./tasks/TaskRepository";

// connect mongodb
mongoose.connect(URI, { useNewUrlParser: true, keepAlive: true });

// start tasks
new CurrencyTask().start();
new PriceTask().start();
new ResetDemoTask().start();
// (new MarketTask()).start();

const taskRepository = TaskRepository.getInstance();
// taskRepository.addTask(new CoinImageTask());
// taskRepository.execute("coin-image-task");
// taskRepository.execute("currency-task");

if (!DEVELOPMENT) {
    taskRepository.scheduleAll();
    // taskRepository.execute("coin-image-task");
}

createServer(5000, "0.0.0.0").then((server) => {
    server.start((err: any) => {
        if (err) {
            throw err;
        }
        console.log("Server running at: ", server.info.uri);
    });
});

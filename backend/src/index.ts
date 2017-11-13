import mongoose from "./db";
import { createServer } from "./server";
import CurrencyTask from "./tasks/CurrencyTask";
import MarketTask from "./tasks/MarketTask";
import PriceTask from "./tasks/PriceTask";
import ResetDemoTask from "./tasks/ResetDemoTask";
import { DEVELOPMENT } from "./constants";

import TaskRepository from "./tasks/TaskRepository";
import CoinImageTask from "./tasks/CoinImageTask";

// connect mongodb
const URI = "mongodb://mongo/crypto_buy";
mongoose.connect(URI);

// start tasks
(new CurrencyTask()).start();
(new PriceTask()).start();
(new ResetDemoTask()).start();
(new MarketTask()).start();

const taskRepository = TaskRepository.getInstance();
taskRepository.addTask(new CoinImageTask());
if (!DEVELOPMENT) {
  taskRepository.scheduleAll();
  taskRepository.execute("coin-image-task");
}

createServer(5000, "0.0.0.0").then((server) => {
  server.start((err: any) => {
    if (err) { throw err; }
    console.log("Server running at: ", server.info.uri);
  });
});

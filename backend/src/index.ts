import mongoose from './db';
import { createServer } from './server';
import CurrencyTask from './tasks/CurrencyTask';
import PriceTask from './tasks/PriceTask';
import ResetDemoTask from './tasks/ResetDemoTask';

// connect mongodb
const URI = 'mongodb://mongo/crypto_buy';
mongoose.connect(URI);

// start tasks
(new CurrencyTask()).start();
(new PriceTask()).start();
(new ResetDemoTask()).start();

createServer(5000, '0.0.0.0').then(server => {
  server.start(err => {
    if (err) throw err;
    console.log('Server running at: ', server.info.uri);
  });
});

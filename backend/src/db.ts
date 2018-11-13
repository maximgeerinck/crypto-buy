import mongoose = require("mongoose");
export const URI = "mongodb://mongo/crypto_buy";

const options = { promiseLibrary: global.Promise };
mongoose.Promise = global.Promise;

export default mongoose;

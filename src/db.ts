import mongoose = require('mongoose');


const options = { promiseLibrary: global.Promise };
mongoose.Promise = global.Promise;

export default mongoose;
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/scl-forum';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
module.exports = mongoose;
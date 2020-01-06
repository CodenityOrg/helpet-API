const mongoose = require('mongoose');
const config = require("../deploy");

const connect = () => mongoose
.connect(config.dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => console.log(`DB Connection Error: ${err.message}`));

const drop = () => connect().then(() => mongoose.connection.db.dropDatabase()).then(() => console.log("Droped!"));

module.exports = {
    connect,
    drop,
};
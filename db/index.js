const mongoose = require("mongoose");

const connect = () => {
  const databaseUrl = process.env.MONGODB_URI;
  mongoose
    .connect(databaseUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => console.log("DB Connected!"))
    .catch(err => console.log(`DB Connection Error: ${err.message}`));
};

module.exports = {
  connect
};

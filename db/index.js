const mongoose = require("mongoose");

const connect = () => {
  const databaseUrl = ["production", "development"].includes(
    process.env.NODE_ENV
  )
    ? `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}/${process.env.DBNAME}?retryWrites=true&w=majority`
    : `mongodb://localhost:27017/${process.env.DBNAME}?retryWrites=true&w=majority`;
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

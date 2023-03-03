const mongoose = require("mongoose");

const connect = () =>{
  mongoose
    .connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.lx7tr.mongodb.net/?retryWrites=true&w=majority`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => console.log("DB Connected!"))
    .catch(err => console.log(`DB Connection Error: ${err.message}`));
  }

module.exports = {
  connect,
};

const mongoose = require("mongoose");

const { Schema } = mongoose;

const preferenceSchema = new Schema({
  opts: Object
});

module.exports = mongoose.model("Preference", preferenceSchema);

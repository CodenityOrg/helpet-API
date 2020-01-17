const mongoose = require("mongoose");

const { Schema } = mongoose;

const photoSchema = new Schema({
  name: String,
  path: String,
  thumbnailPath: String
});

module.exports = mongoose.model("Photo", photoSchema);

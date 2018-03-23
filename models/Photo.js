const mongoose = require("mongoose")
const Schema = mongoose.Schema

const photoSchema = new Schema({
    name: String,
    path: String,
    thumbnailPath: String,
    postId: String
})

module.exports = mongoose.model("Photo", photoSchema)
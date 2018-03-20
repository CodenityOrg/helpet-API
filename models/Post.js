const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    description: String,
    userId: String,
    race: String,
    age: String,
    kind: String,
    position: Object,
    cellphone: String
})

module.exports = mongoose.model("Post", postSchema)
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    name: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    address: String,
    gender: String,
    date: Date,
    type: Number,
    latitude: Number,
    longitude: Number,
    cellphone: String,
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
})


module.exports = mongoose.model("Post", postSchema)
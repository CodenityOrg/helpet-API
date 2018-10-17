const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    name: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    race: String,
    address: String,
    gender: String,
    kind: String,
    date: Date,
    type: Number,
    latitude: Number,
    longitude: Number,
    cellphone: String,
    features: [{ type: Schema.Types.ObjectId, ref: "Feature" }],
    photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
})


module.exports = mongoose.model("Post", postSchema)
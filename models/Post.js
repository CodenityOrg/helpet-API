const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    name: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    address: String,
    gender: String,
    type: Number,
    title: String,
    latitude: Number,
    longitude: Number,
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Post", postSchema)
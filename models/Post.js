const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    name: String,
    description: String,
    userId: String,
    race: String,
    gender: String,
    kind: String,
    date: Date,
    loc: {
        type: { type: String },
        coordinates: [],
    },
    cellphone: String,
    photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }]
})

postSchema.index({ loc: "2dsphere" })

module.exports = mongoose.model("Post", postSchema)
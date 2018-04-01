const mongoose = require("mongoose")
const Schema = mongoose.Schema

const preferenceSchema = new Schema({
    opts: Object
})

preferenceSchema.index({ position: "2d" })

module.exports = mongoose.model("Preference", preferenceSchema)
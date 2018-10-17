const mongoose = require("mongoose")
const Schema = mongoose.Schema

const preferenceSchema = new Schema({
    opts: Object
})

module.exports = mongoose.model("Preference", preferenceSchema)
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const featureSchema = new Schema({
    name: String,
    postId: String
})

featureSchema.statics.findOrCreate = (filter, model) => {
    this.findOne(filter).exec()
        .then((feature) => {
            if (!feature) {
                return this.create(model)
            }
            return feature
        })
}

module.exports = mongoose.model("Feature", featureSchema)
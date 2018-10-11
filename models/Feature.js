const mongoose = require("mongoose")
const Schema = mongoose.Schema

const featureSchema = new Schema({
    value: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' }
})

featureSchema.statics.findOrCreate = function (filter, model) {
    return this.findOne(filter).exec()
        .then((feature) => {
            if (!feature) {
                return this.create(model)
            }
            return feature
        })
}

module.exports = mongoose.model("Feature", featureSchema)
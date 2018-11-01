const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tagSchema = new Schema({
    value: String,
})

tagSchema.statics.findOrCreate = function (filter, model) {
    return this.findOne(filter).exec()
        .then((tag) => {
            if (!tag) {
                return this.create(model);
            }
            return tag;
        })
}

module.exports = mongoose.model("Tag", tagSchema)
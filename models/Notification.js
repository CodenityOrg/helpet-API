const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    read: {
        type: Boolean,
        default: false
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model("Notification", notificationSchema)

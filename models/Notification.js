const mongoose = require("mongoose");

const { Schema } = mongoose;

const notificationSchema = new Schema({
  read: {
    type: Boolean,
    default: false
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);

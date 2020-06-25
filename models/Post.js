const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  name: String,
  description: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  address: String,
  gender: String,
  type: Number,
  title: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      default: "Point", // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  photos: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

postSchema.index({ location: "2dsphere" }, { background: false });

module.exports = mongoose.model("Post", postSchema);

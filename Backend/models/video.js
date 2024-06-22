const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const commentSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
); // Embed comment schema within the video schema without creating a separate collection

const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    tags: [{ type: String }],
    categories: [{ type: String }],
    uploader: { type: Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [commentSchema],
    duration: { type: Number, required: true }, // Duration in seconds
    uploadDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Public", "Private", "Unlisted"],
      default: "Public",
    },
    resolution: {
      type: String,
      enum: ["360p", "480p", "720p", "1080p", "4K"],
      default: "1080p",
    },
    likesBy: [{ type: Types.ObjectId, ref: "User" }], // Track users who liked the video
    dislikesBy: [{ type: Types.ObjectId, ref: "User" }], // Track users who disliked the video
    isLive: { type: Boolean, default: false },
  },
);

const Video = model("Video", videoSchema);

module.exports = Video;

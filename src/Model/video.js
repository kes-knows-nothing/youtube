import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{ type: String }],
    meta: {
        views: {type: Number, required: true, default: 0},
        rating: {type: Number, required: true, default: 0},
    }
});

const Video = mongoose.model("Video", videoSchema)
export default Video;
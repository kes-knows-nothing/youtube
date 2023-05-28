import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    fileUrl: {type: String, required: true},
    description: String,
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{ type: String }],
    meta: {
        views: {type: Number, required: true, default: 0},
        rating: {type: Number, required: true, default: 0},
    },
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"User"}
});

const Video = mongoose.model("Video", videoSchema)
export default Video;
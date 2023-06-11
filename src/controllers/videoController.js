import Video from "../models/Video"
import User from "../models/User";
import Comment from "../models/Comment"
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos})
}

export const watch = async (req, res) => {
    
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    
    if(video){
        return res.render("watch" , { pageTitle: "Watch", video})
    } else {
        return res.render("404", {pageTitle: "Video not found!"})
    }
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", {pageTitle: "Video not found!"})
    } 
    
    if (String(video.owner) !== _id) {
        return res.status(403).redirect("/")
    }
    
    return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id: id});
    console.log(`세션 로그인 아이디 ${_id}`)

    if (!video) {
        return res.render("404", {pageTitle: "Video not found!"})
    }

    const video1 = await Video.findById(id)
    console.log(video1)
    if (String(video1.owner) !== String(_id)) {
        console.log("wrong id")
        return res.status(403).redirect("/")
    }

    await Video.findByIdAndUpdate(id, {
            title, 
            description, 
            hashtags: hashtags
            .split(",")
            .map((word) => (word.startsWith("#") ? word : `#${word}`))
        });
        req.flash("ok", "success")
        console.log("done")
        return res.redirect(`/videos/${id}`);
};
    


export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video"})
}

export const postUpload = async (req, res) => {
    const { user: {_id } } = req.session;
    const { file } = req;
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            title, 
            description,
            fileUrl: file.path,
            owner: _id,
            createdAt: Date.now(),
            hashtags: hashtags.split(",").map((word) =>(word.startsWith("#") ? word : `#${word}`)),
            meta: {
                views:0,
                rating:0,
            },
        })
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");

    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error.Message})
    }
}

export const deleteVideo = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", {pageTitle: "Video not found!"})
    } 
    if (String(video.owner) !== _id) {
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/")
    }
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/")
}

export const search =  async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
     if (keyword) {
        videos = await Video.find({
            title: {
              $regex: new RegExp(`${keyword}$`, "i"),
            },
          });
    } 
    return res.render("search", { pageTitle: "Search", videos });
};


export const registerView = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id)
    
    if(!video) {
        return res.sendStatue(404);
    }
    
    video.meta.views = video.meta.views + 1
    await video.save();
    return res.sendStatus(200)
};

export const createComment = async (req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id }
    } = req;
    const video = await Video.findById(id)
    
    if(!video){
        return res.sendStatue(404);
    } else {
        const comment = await Comment.create({
            text: text,
            owner: user._id,
            video: id,
        });
        video.comments.push(comment._id);
        video.save();
        
        return res.status(201).json({ newCommentId: comment._id });
    }
}

export const deleteComment = async (req, res) => {
    const userId = req.session.user._id;
    const commentId = req.params.commentid;
    const videoId = req.params.videoid;
    console.log(`코멘트: ${commentId}`);
    console.log(`비디오: ${videoId}`);
    console.log(userId);
    const comment = await Comment.findById(commentId);
    console.log(`이거임 ${comment}`)
    if (!comment) {
        return res.sendStatue(404)
    }
    await Comment.findByIdAndDelete(comment._id)
    console.log("job done!")
    // const video = await Video.findById(videoId);
    await Video.updateOne(
        { _id: videoId },
        {
          $pull: {
            comments: commentId,
          },
        }
      );
    // video.comments = (video.comments).filter((id) => id !== commentId);
    return res.sendStatus(200);
}
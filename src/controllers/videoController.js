import Video from "../models/Video"
import User from "../models/User";

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos})
}

export const watch = async (req, res) => {
    
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    
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
    if (!video) {
        return res.render("404", {pageTitle: "Video not found!"})
    }
    if (String(video.owner) !== _id) {
        return res.status(403).redirect("/")
    }

    await Video.findByIdAndUpdate(id, {
            title, 
            description, 
            hashtags: hashtags
            .split(",")
            .map((word) => (word.startsWith("#") ? word : `#${word}`))
        })
        return res.redirect(`/videos/${id}`);
    }
    
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video"})
}

export const postUpload = async (req, res) => {
    const { user: {_id } } = req.session;
    const file = req.file;
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
        return res.status(403).redirect("/")
    }
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/")
}

export const search =  (req, res) => {

    return res.render("search", { pageTitle: "Search" });
};

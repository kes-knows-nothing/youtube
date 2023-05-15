import Video from "../Model/video"

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos})
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(video){
        return res.render("watch" , { pageTitle: "Watch", video})
    } else {
        return res.render("404", {pageTitle: "Video not found!"})
    }
    
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", {pageTitle: "Video not found!"})
    } else {
        return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
    };
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id: id});
    if (!video) {
        return res.render("404", {pageTitle: "Video not found!"})
    } else {
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
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title, 
            description,
            createdAt: Date.now(),
            hashtags: hashtags.split(",").map((word) =>(word.startsWith("#") ? word : `#${word}`)),
            meta: {
                views:0,
                rating:0,
            },
        })
        return res.redirect("/");

    } catch (error) {
        console.log(error);
        return res.render("upload", {pageTitle: "Upload Video", errorMessage: error.Message})
    }
}

export const deleteVideo = async (req, res) => {
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/")
}

export const search =  (req, res) => {

    return res.render("search", { pageTitle: "Search" });
};

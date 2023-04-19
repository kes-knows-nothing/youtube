import express from "express";
import { edit, watch, trending, videohome } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/", videohome)
videoRouter.get("/edit", edit)
videoRouter.get("/trending", trending)
videoRouter.get("/watch", watch)

export default videoRouter;
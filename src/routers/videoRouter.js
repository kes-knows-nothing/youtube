import express from "express";
import { postEdit, getEdit, watch, getUpload, postUpload, deleteVideo } from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).all(protectorMiddleware).post(postUpload);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);

export default videoRouter;
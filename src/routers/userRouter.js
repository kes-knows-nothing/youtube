import express from "express";
import { getEdit, postEdit, profile, remove, startGibhubLogin, finishGibhubLogin, logout, getChangepassword, postChangepassword} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();


userRouter.get("/logout", protectorMiddleware,logout);
userRouter.get("/remove", remove);
userRouter.get("/github/start",publicOnlyMiddleware ,startGibhubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware ,finishGibhubLogin);
userRouter.route("/changepassword").get(getChangepassword).post(postChangepassword);
userRouter.get("/:id", protectorMiddleware, profile);
userRouter.route("/:id/edit").all(protectorMiddleware).get( getEdit).post(postEdit);


export default userRouter;
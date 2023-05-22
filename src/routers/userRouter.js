import express from "express";
import { getEdit, postEdit, profile, remove, startGibhubLogin, finishGibhubLogin, logout} from "../controllers/userController";

const userRouter = express.Router();


userRouter.get("/logout", logout);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGibhubLogin);
userRouter.get("/github/finish", finishGibhubLogin);
userRouter.get("/:id", profile);
userRouter.route("/:id/edit").get(getEdit).post(postEdit);


export default userRouter;
import express from "express";
import { edit, profile, remove, startGibhubLogin, finishGibhubLogin} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", profile);

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGibhubLogin);
userRouter.get("/github/finish", finishGibhubLogin);

export default userRouter;
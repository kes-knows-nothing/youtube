import express from "express";
import { edit, profile, remove} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", profile);

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);

export default userRouter;
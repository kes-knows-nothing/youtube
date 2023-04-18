import express from "express";
import { edit, join, remove } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);

userRouter.get("/remove", remove);

export default userRouter;
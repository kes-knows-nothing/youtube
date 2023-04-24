import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";


const app = express();
const logger = morgan("dev")

app.set('view engine' , 'pug'); // 확장자 지정
app.set('views', process.cwd() + "/src/views"); // 폴더 경로 지정
app.use(logger)
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);

export default app
import express from "express";
import morgan from "morgan";
import session from "express-session"
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import flash from "express-flash"
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";


const app = express();
const logger = morgan("dev")

app.set('view engine', 'pug'); // 확장자 지정
app.set('views', process.cwd() + "/src/views"); // 폴더 경로 지정
app.use(logger)
app.use("/uploads", express.static("uploads"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2000000,
        },
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL
        })
    })
);
app.use(flash());
app.use(localsMiddleware)
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app
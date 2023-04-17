import express from "express";
import morgan from "morgan";

const app = express();
const logger = morgan("dev")

app.use(logger)

const sayYes = (req, res) => {
  console.log("Yes")
  return res.send("<h1>I was born to love you</h1>")
}

app.get("/", sayYes);

app.listen(3000, function() {
  console.log("Server is running on port 3000.")
})
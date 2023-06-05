import "dotenv/config"
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = process.env.PORT || 4000;


app.listen(PORT, function() {
    console.log("Server is running on port 4000.")
  })
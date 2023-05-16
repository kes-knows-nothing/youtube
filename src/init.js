import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

app.listen(4000, function() {
    console.log("Server is running on port 4000.")
  })
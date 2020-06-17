//import dependancys
const express = require("express");
//Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
const cors = require("cors");
//Helps to connect to mongoDB
const mongoose = require("mongoose");
// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.
require("dotenv").config();
const path = require("path");

//create Express Server
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json({ limit: "5mb", extended: true }));

//Set mongoDb to connect
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

//load the routes
const userRoute = require("./routes/userRoute");
const blogPostRoute = require("./routes/blogPostRoute");
const UserBlogRoute = require("./routes/UserBlogRoute");
const toDoRoute = require("./routes/toDoRoute");
const commentsRoute = require("./routes/commentsRoute");

//use routes
app.use("/user", userRoute);
app.use("/apps/blog", blogPostRoute);
app.use("/user/blog", UserBlogRoute);
app.use("/toDoList", toDoRoute);
app.use("/blog/comments", commentsRoute);

//Run this if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  // //redirect to the build folder
  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "client/build/index.html"));
  // });
}

// start listen on the port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

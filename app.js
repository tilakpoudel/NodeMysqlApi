const express = require("express");
const bodyParser = require("body-parser");
// create express app
const app = express();
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

// include the route files
const postRoutes = require("./routes/posts.routes");
const userRoutes = require("./routes/users.routes");
const imageRoute = require("./routes/images.routes");

// use the routes in the app
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/images", imageRoute);

module.exports = app;

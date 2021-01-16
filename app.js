const express = require("express");
const bodyParser = require("body-parser");
// create express app
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

const postRoutes = require("./routes/posts.routes");
app.use("/posts", postRoutes);

const userRoutes = require("./routes/users.routes");
app.use("/user", userRoutes);

module.exports = app;

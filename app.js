
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db = require('./db/db.js');



const articleRoutes = require("./api/routes/articles");
const commentRoutes = require("./api/routes/comments");
const querieRoutes = require("./api/routes/queries");
const professionRoutes = require("./api/routes/professions");
const serviceRoutes =  require("./api/routes/services");
const skillRoutes =  require("./api/routes/skills");
const userRoutes = require('./api/routes/user');


//mongoose.connect('mongodb+srv://kabano:kabano@blogapicluster.5qfoo.mongodb.net/<dbname>?retryWrites=true&w=majority');
db.connect();

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/articles", articleRoutes);
app.use("/articles/:articleId/comments", commentRoutes);
app.use("/queries", querieRoutes);
app.use("/professions", professionRoutes);
app.use("/services", serviceRoutes);
app.use("/skills", skillRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
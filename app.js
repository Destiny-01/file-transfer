const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const filesRouter = require("./routes/files");
const db = require("./db/db");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
db();
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.locals.calcFileSize = (bytes) => {
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

app.use("/", filesRouter);

module.exports = app;

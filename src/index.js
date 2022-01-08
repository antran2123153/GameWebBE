var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
const cors = require("cors");
const route = require("./routes");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const PORT = process.env.PORT || 4000;
var app = express();

const connectToDatabase = require("./config/db");
connectToDatabase();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

route(app);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;

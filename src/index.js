const createError = require("http-errors");
const dotenv = require("dotenv");
const express = require("express");
const logger = require("morgan");
const route = require("./routes");
const connectToDatabase = require("./config/db");

const PORT = process.env.PORT || 3000;

const app = express();

dotenv.config({ path: "./config/.env" });

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const cors = require("cors");
app.use(cors(corsOptions));

connectToDatabase();

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

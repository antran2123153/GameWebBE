const accountRouter = require("./account");

function route(app) {
  app.use("/api/account", accountRouter);
}

module.exports = route;

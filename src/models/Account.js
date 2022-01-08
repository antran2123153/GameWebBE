const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  fullname: { type: String },
  birthday: { type: String },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("account", accountSchema);

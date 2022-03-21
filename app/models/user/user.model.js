const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Detail",
    },

    uid: String,
    email: String,
    displayName: String,
    role: String,
    status: Boolean,
  }).plugin(sanitizerPlugin)
);

module.exports = User;

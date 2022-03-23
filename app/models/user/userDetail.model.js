const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const User_Detail = mongoose.model(
  "User_Detail",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    firstName: String,
    lastName: String,
    profileImage: {type: String, default: ""},
  }).plugin(sanitizerPlugin)
);

module.exports = User_Detail;

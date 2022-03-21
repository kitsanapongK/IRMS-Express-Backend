const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const User_Setting = mongoose.model(
  "User_Setting",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    key: String,
    state: Boolean,
  }).plugin(sanitizerPlugin)
);

module.exports = User_Setting;

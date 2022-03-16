const mongoose = require("mongoose");
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    uid : String,
    email : String,
    displayName: String,

  }).plugin(sanitizerPlugin)
);

module.exports = User;

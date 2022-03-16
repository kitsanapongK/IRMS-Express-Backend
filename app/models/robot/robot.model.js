const mongoose = require("mongoose");
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const Robot = mongoose.model(
  "Robot",
  new mongoose.Schema({
    robotKey : String,
    serverAuthToken : String,
    ownerId: String,
    user:
        [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
        }]
    ,
  }).plugin(sanitizerPlugin)
);

module.exports = Robot;

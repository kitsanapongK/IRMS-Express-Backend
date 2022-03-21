const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const Robot = mongoose.model(
  "Robot",
  new mongoose.Schema({
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    robotUid: String,
    robotName: String,
    lastOperationTime: Date,
  }).plugin(sanitizerPlugin)
);

module.exports = Robot;

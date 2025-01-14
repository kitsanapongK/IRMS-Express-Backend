const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const Robot = mongoose.model(
  "Robot",
  new mongoose.Schema({
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    displayName: String,
    key: String,
    lastOperationTime: { type: String, default: "" },
  }).plugin(sanitizerPlugin)
);

module.exports = Robot;

const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const RobotNotification = mongoose.model(
  "RobotNotification",
  new mongoose.Schema({
    robotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "robot",
    },

    message: String,
    userAcknowledge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    isView: Boolean,
    isComplete: Boolean,
  }).plugin(sanitizerPlugin)
);

module.exports = RobotNotification;

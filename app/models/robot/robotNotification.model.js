const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const Robot_Notification = mongoose.model(
  "Robot_Notification",
  new mongoose.Schema({
    robotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Robot",
    },
    message: String,
    userAcknowledge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isView: Boolean,
    isComplete: Boolean,
  }).plugin(sanitizerPlugin)
);

module.exports = Robot_Notification;

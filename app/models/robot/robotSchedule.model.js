const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const RobotSchedule = mongoose.model(
  "RobotSchedule",
  new mongoose.Schema({
    robotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "robot",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    scheduleType: String,
  }).plugin(sanitizerPlugin)
);

module.exports = RobotSchedule;

const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const RobotSetting = mongoose.model(
  "RobotSetting",
  new mongoose.Schema({
    robotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "robot",
    },

    key: String,
    state: Boolean,
  }).plugin(sanitizerPlugin)
);

module.exports = RobotSetting;

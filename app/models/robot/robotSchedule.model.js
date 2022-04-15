const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const Robot_Schedule = mongoose.model(
  "Robot_Schedule",
  new mongoose.Schema({
    robotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Robot",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    activate: Boolean,
    name: String,
    hour: Number,
    minute: Number,
    interval: String,
    daySelected: Object,
  }).plugin(sanitizerPlugin)
);

module.exports = Robot_Schedule;

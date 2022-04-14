const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const Robot_Video = mongoose.model(
  "Robot_Video",
  new mongoose.Schema(
    {
      robotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Robot",
      },
      fileName: String,
      url: String,
      date: Date,
    },
    { timestamps: true }
  ).plugin(sanitizerPlugin)
);

module.exports = Robot_Video;

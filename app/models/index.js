const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user/user.model");
db.robot = require("./robot/robot.model");

module.exports = db;
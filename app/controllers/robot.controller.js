const db = require("../models");
const moment = require("moment");
const FormData = require("form-data");
const User = db.user;
const Robot = db.robot;

const sanitize = require("mongo-sanitize");

exports.pair_robot = async (req, res) => {
  try {
    const robot_key = req.body.robot_key;
    const server_auth_token = req.body.server_auth_token;
    const owner_id = req.body.owner_id;
    new_robot = new Robot({
      robotKey: sanitize(robot_key),
      serverAuthToken: sanitize(server_auth_token),
      ownerId: sanitize(owner_id),
    });
    await new_robot.save();
  } catch (err) {
    console.log(err);
  }
};

exports.add_robot = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
  }
  catch (err) {

  }
}
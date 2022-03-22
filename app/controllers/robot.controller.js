const db = require("../models");
const moment = require("moment");
const FormData = require("form-data");
const User = db.user;
const Robot = db.robot;
const Robot_Statistic = db.robot_statistic;

const sanitize = require("mongo-sanitize");

exports.add_robot = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const new_robot = new Robot({
      ownerId: user,
      displayName: sanitize(req.body.displayName),
      key: sanitize(req.body.key),
    });
    await new_robot.save();
    return res.status(200).send({ message: "Robot added" });
  } catch (err) {
    console.log(err);
    return res.status(200).send(err);
  }
};

exports.view_statistic = async (req, res) => {
  try {
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    console.log(robot);
    const statistic_list = await Robot_Statistic.find({ robotId: robot.id });
    return res.status(200).send(statistic_list);
  } catch (err) {
    console.log(err);
    return res.status(200).send(err);
  }
};

exports.delete_statistic = async (req, res) => {
  try {
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const statistic = await Robot_Statistic.findById(
      sanitize(req.body.statisticId)
    );
    if (!statistic) {
      return res.status(404).send({ message: "record not found" });
    }
    await statistic.delete();
    return res.status(200).send({ message: "record deleted" });
  } catch (err) {
    console.log(err);
    return res.status(200).send(err);
  }
};

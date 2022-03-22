const db = require("../models");
const sanitize = require("mongo-sanitize");
const User = db.user;
const Robot = db.robot;
const Robot_Statistic = db.robot_statistic;

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
    return res.status(500).send(err);
  }
};

exports.delete_robot = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    if (!robot.ownerId.equals(user.id)) {
      return res
        .status(403)
        .send({ Message: "You don't have permission to delete this robot." });
    }
    await robot.delete();
    return res.status(200).send({ message: "robot deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.edit_robot = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    if (!robot.ownerId.equals(user.id)) {
      return res
        .status(403)
        .send({ Message: "You don't have permission to edit this robot." });
    }
    if (req.body.displayName) {
      robot.displayName = sanitize(req.body.displayName);
    }
    await robot.save();
    return res.status(200).send(robot);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.robot_detail = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    if (!robot) {
      return res.status(404).send({ message: "robot not found" });
    }
    return res.status(200).send(robot);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.view_statistic = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const statistic_list = await Robot_Statistic.find({ robotId: robot.id });
    return res.status(200).send(statistic_list);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.delete_statistic = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const statistic = await Robot_Statistic.findById(
      sanitize(req.body.statisticId)
    );
    if (!statistic) {
      return res.status(404).send({ message: "record not found" });
    }
    if (!statistic.robotId.equals(robot.id) || !robot.ownerId.equals(user.id)) {
      return res
        .status(403)
        .send({ Message: "You don't have permission to edit this record." });
    }
    await statistic.delete();
    return res.status(200).send({ message: "record deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.statistic_summary = async (req, res) => {
  try {
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const statistic_summary = await Robot_Statistic.aggregate([
      { $match: { robotId: { $in: [robot._id] } } },
      {
        $addFields: {
          duration: {
            $divide: [{ $subtract: ["$timeStop", "$timeStart"] }, 3600000],
          },
        },
      },
      {
        $group: {
          _id: { robotId: "$robotId" },
          sumOfTotalDistance: { $sum: "$totalDistance" },
          sumOfTotalTime: { $sum: "$duration" },
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).send(statistic_summary);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

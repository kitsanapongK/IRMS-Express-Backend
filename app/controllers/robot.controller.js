const db = require("../models");
const moment = require("moment");
const sanitize = require("mongo-sanitize");
const User = db.user;
const Robot = db.robot;
const Robot_Statistic = db.robot_statistic;
const Robot_Video = db.robot_video;
const Robot_Schedule = db.robot_schedule;

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
          durationTotal: {
            $divide: [{ $subtract: ["$timeStop", "$timeStart"] }, 1000],
          },
        },
      },
      {
        $group: {
          _id: { robotId: "$robotId" },
          sumOfTotalDistance: { $sum: "$totalDistance" },
          sumOfTotalTime: { $sum: "$durationTotal" },
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

exports.save_statistic = async (req, res) => {
  try {
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    if (!robot) {
      return res.status(404).send();
    }
    await new Robot_Statistic({
      robotId: robot,
      timeStart: moment(req.body.startTime, "HH:mm:ss"),
      timeStop: moment(req.body.stopTime, "HH:mm:ss"),
      duration: req.body.duration,
      totalDistance: req.body.dist,
    }).save();
    robot.lastOperationTime = req.body.duration;
    await robot.save();
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

exports.view_video = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const video_list = await Robot_Video.find({ robotId: robot.id });
    return res.status(200).send(video_list);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.delete_video = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const video = await Robot_Video.findById(sanitize(req.body.videoId));
    if (!video) {
      return res.status(404).send({ message: "record not found" });
    }
    if (!video.robotId.equals(robot.id) || !robot.ownerId.equals(user.id)) {
      return res
        .status(403)
        .send({ Message: "You don't have permission to edit this record." });
    }
    await video.delete();
    return res.status(200).send({ message: "record deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.view_schedule = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const schedule_list = await Robot_Schedule.find({ robotId: robot.id }).sort(
      { hour: 1, minute: 1 }
    );
    return res.status(200).send(schedule_list);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.create_schedule = async (req, res) => {
  try {
    console.log(req.body.daySelected)
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    if (!robot) {
      return res.status(404).send();
    }
    await new Robot_Schedule({
      robotId: robot,
      userId: user,
      activate: req.body.activate,
      name: req.body.name,
      hour: req.body.hour,
      minute: req.body.minute,
      interval: req.body.interval,
      daySelected: req.body.daySelected,
    }).save();
    const schedule_list = await Robot_Schedule.find({ robotId: robot.id }).sort(
      { hour: 1, minute: 1 }
    );
    return res.status(200).send(schedule_list);
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

exports.delete_schedule = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const schedule = await Robot_Schedule.findById(
      sanitize(req.body.scheduleId)
    );
    if (!schedule) {
      return res.status(404).send({ message: "record not found" });
    }
    if (!schedule.robotId.equals(robot.id) || !robot.ownerId.equals(user.id)) {
      return res
        .status(403)
        .send({ Message: "You don't have permission to edit this record." });
    }
    await schedule.delete();
    return res.status(200).send({ message: "record deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.toggle_schedule = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const robot = await Robot.findOne({ key: sanitize(req.params.robotKey) });
    const schedule = await Robot_Schedule.findById(
      sanitize(req.body.scheduleId)
    );
    if (!schedule) {
      return res.status(404).send({ message: "record not found" });
    }
    if (!schedule.robotId.equals(robot.id) || !robot.ownerId.equals(user.id)) {
      return res
        .status(403)
        .send({ Message: "You don't have permission to edit this record." });
    }
    schedule.activate = req.body.activate;
    await schedule.save();
    return res.status(200).send({ state: schedule.activate });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

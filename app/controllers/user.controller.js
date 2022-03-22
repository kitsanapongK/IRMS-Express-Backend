const db = require("../models");
const sanitize = require("mongo-sanitize");
const User = db.user;
const User_Detail = db.user_detail;
const User_Setting = db.user_setting;

exports.edit_user = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      const user_detail = await User_Detail.findById(user.userDetail);
      if (req.body.firstName) {
        user_detail.firstName = sanitize(req.body.firstName);
      }
      if (req.body.lastName) {
        user_detail.lastName = sanitize(req.body.lastName);
      }
      if (req.files) {
        user_detail.profileImage =
          req.files.profileImage.data.toString("base64");
      }
      await user_detail.save();
      return res.status(200).send({
        firstName: user_detail.firstName,
        lastName: user_detail.lastName,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.update_image = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      const user_detail = await User_Detail.findById(user.userDetail);
      if (req.files) {
        user_detail.profileImage =
          req.files.profileImage.data.toString("base64");
      }
      await user_detail.save();
      return res.status(200).send(user_detail.profileImage);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.user_detail = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("userDetail")
      .populate("userDetail");
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.user_setting_list = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const user_setting = await User_Setting.find({ userId: user }).select(
      "-userId"
    );
    return res.status(200).send(user_setting);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.edit_user_setting = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const user_setting = await User_Setting.findById(req.body.settingId);
    if (!user_setting) {
      return res.status(404).send({ Message: "Setting not found" });
    }
    if (!user_setting.userId.equals(user.id)) {
      return res
        .status(403)
        .send({ Message: "You don't have permission to edit this setting." });
    }
    user_setting.state = sanitize(req.body.state);
    await user_setting.save();
    return res.status(200).send({ Mesasge: "Success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

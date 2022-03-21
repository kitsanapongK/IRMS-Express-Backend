const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// Firebase
const admin = require("firebase-admin");

/** Check token by get access token first.
 * Then return the confirm message.
 */
checkUser = async (req, res, next) => {
  try {
    const user = await admin.auth().getUserByEmail(req.body.email);
    console.log(user);
  } catch (err) {}
};
verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    const decoded = jwt.verify(token, config.access_secret);
    const user = await User.findById(decoded.id);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("userDetailID");
    if (user.userDetailID.roleID === 1) {
      return next();
    } else {
      res.status(403).send({ message: "Permission Denied" });
    }
  } catch (err) {
    return res.status(500).send({ message: "internal server error" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;

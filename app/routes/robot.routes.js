const { auth } = require("firebase-admin");

module.exports = function (app) {
  const router = require("express").Router();
  const { authJwt } = require("../middlewares");
  const robotController = require("../controllers/robot.controller");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/add", authJwt.verifyToken, robotController.add_robot);
  router.get(
    "/:robotKey/statistic/list",
    authJwt.verifyToken,
    robotController.view_statistic
  );
  router.post(
    "/:robotKey/statistic/delete",
    authJwt.verifyToken,
    robotController.delete_statistic
  );

  app.use("/apis/robot", router);
};

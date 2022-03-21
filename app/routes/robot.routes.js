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

  router.post("/add", robotController.add_robot);

  app.use("/apis/robot", router);
};

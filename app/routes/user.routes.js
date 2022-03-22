const { auth } = require("firebase-admin");

module.exports = function (app) {
  const router = require("express").Router();
  const { authJwt } = require("../middlewares");
  const userController = require("../controllers/user.controller");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/detail", [authJwt.verifyToken], userController.user_detail);
  router.post("/edit", [authJwt.verifyToken], userController.edit_user);
  router.post("/image", [authJwt.verifyToken], userController.update_image);
  router.get(
    "/setting",
    [authJwt.verifyToken],
    userController.user_setting_list
  );
  router.post(
    "/setting",
    [authJwt.verifyToken],
    userController.edit_user_setting
  );

  app.use("/apis/user", router);
};

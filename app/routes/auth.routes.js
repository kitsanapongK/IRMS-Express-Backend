module.exports = function (app) {
  const router = require("express").Router();
  const { authJwt } = require("../middlewares");
  const authController = require("../controllers/auth.controller");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/get", authController.users_list);
  router.get("/verify/:token", authController.verify_email);
  router.post("/signin", authController.signin);
  router.post("/signup", authController.sign_up);
  router.post("/forgot-pwd", authController.generate_forgot_pwd_email);
  router.post("/reset-pwd", authController.reset_pwd);

  app.use("/apis/auth", router);
};

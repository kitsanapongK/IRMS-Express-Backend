module.exports = function(app) {
    var router = require("express").Router();
    const { authJwt } = require("../middlewares");
    const userController = require("../controllers/user.controller");
    const path = require('path');
  
    app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    router.get("/get",
        userController.users_list
    );

    router.get("/detail",
        [authJwt.verifyToken],
        userController.user_detail
    )

    router.post("/token",
        userController.generate_token
    )
    
    app.use('/apis/user', router);
  };
  
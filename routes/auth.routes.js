const { verifySignUp } = require("../middlewares");
const controller = require("../controller/user.controller");

module.exports = function(app) {
 

  app.post(
    "/api/auth/signup",
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  
};
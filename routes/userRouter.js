const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { body, query, param } = require("express-validator");



router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("password should not be empty"),
  ],
  controller.login
);


router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("name should not be empty"),
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("password should not be empty"),
  ],
  controller.register
);



// router.post("/google_login", controller.googleLogin);
// router.post("/facebook_login", controller.facebookLogin);



module.exports = router;
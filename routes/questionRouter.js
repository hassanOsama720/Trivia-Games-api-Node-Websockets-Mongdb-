const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("./../controllers/questionController");
isAuth = require("./../MW/auth");

router.route("/questions/:questions_amount").get(isAuth ,controller.get_questions);

router
  .route("/questions")
  .post(
    isAuth,
    [
      body("question").notEmpty().withMessage("invalid question."),
      body("correct").isNumeric().withMessage("enter valid correct answer id"),
    ],
    controller.add_question
  );

module.exports = router;
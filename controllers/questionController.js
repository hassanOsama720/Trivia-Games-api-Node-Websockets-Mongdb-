const mongoose = require("mongoose");
const Question = require("./../models/question");
const express = require("express");
const { validationResult } = require("express-validator");


exports.get_questions = (request, response, next) => {
    Question.aggregate(
      [ { $sample: { size: +request.params.questions_amount } } ]
   )
    .then((data) => {
      response.status(200).json({ data });
      console.log(data.length)
    })
    .catch((error) => {
      next(error);
    });
};
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
exports.add_question = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  
    let object = new Question({
      question: request.body.question,
      answers: request.body.answers,
      correct: request.body.correct,
    });
    object
      .save()
      .then((data) => {
        response.status(201).json({ message: "added", data });
      })
      .catch((error) => next(error));
  
  
};
//--------------------------------------------------------------------------------------------------

// exports.delete_question = (request, response, next) => {
//   console.log("delete product function");
//   if (request.role == "admin") {
//     console.log("role is okay");
//     Products.findByIdAndDelete({ _id: request.params.id })
//       .then((data) => {
//         console.log("id:", request.params.id);
//         response.status(201).json({ message: "deleted", data });
//       })
//       .catch((error) => {
//         next(error);
//       });
//   } else {
//     response.status(403).json({ message: "Not Autorized" });
//   }
// };



// exports.update_question = async (req, res) => {
//   try {
//     const updatedProduct = await Products.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// };
//-------------------------------------------------------------------------------------------------------------

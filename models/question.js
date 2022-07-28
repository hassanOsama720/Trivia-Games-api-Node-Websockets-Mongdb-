const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },

  answers: [
    {
        id:{
            type: Number,
            require: true
        },
        answer:{
            type: String,
            required:true

        }
    }
],
  

  correct: {
    type: Number,
    required: true,
  },

  
});

module.exports = mongoose.model("question", questionSchema);
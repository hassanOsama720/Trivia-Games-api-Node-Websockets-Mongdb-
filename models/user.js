const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    max: 50,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  }
});

module.exports = mongoose.model("user", userSchema);
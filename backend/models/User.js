const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});



module.exports = mongoose.model("User", userSchema);
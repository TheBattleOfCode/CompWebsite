const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    teamName: String,
    indivScore: Number,
    teamScore: Number,
    country: String,
    city: String,
    organization: String,
    countSolved:Number,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;

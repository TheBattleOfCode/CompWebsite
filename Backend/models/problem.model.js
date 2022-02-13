const mongoose = require("mongoose");

const Problem = mongoose.model(
  "Problem",
  new mongoose.Schema({
    title: String,
    description: String,
    score: Number,
    inOutContentGen: String,
    type: String
  })
);

module.exports = Problem;

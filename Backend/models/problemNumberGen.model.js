const mongoose = require("mongoose");

const ProblemNumberGen = mongoose.model(
  "ProblemNumberGen",
  new mongoose.Schema({
    title: Number,
    description: String,
    score: Number,
    inOutContentGen: String
  })
);

module.exports = ProblemNumberGen;

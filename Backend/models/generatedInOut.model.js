const mongoose = require("mongoose");

const generatedInOut = mongoose.model(
  "generatedInOut",
  new mongoose.Schema({
    
    genInput: String,
    genOutput: String,
    answered: Boolean,
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    problemId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
    }    
  })
);

module.exports = generatedInOut;

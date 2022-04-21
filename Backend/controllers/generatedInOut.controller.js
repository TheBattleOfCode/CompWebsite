const generatedInOut = require("../models/generatedInOut.model"); 

exports.SaveInOut= (req, res) => {
    const InOut = new generatedInOut({
        genInput: req.body.genInput,
        genOutput: req.body.genOutput,
        userId : req.body.userId,
        problemId : req.body.problemId,
        answered:false
        
    })
    prob.save((err, InOut) => {
        if (err) {
            return res.status(500).send({ message: err });
        }
        else{
            return res.status(201).send({'success':true,message:'inOut Created'})
        }

  }
)}


exports.GetInOut = async (req, res) => {
    try{
        const InOut = await generatedInOut.findOne({userId:req.params.userId, problemId:req.params.problemId}) 
        res.send(InOut)
    
    }catch(err){
        res.status(500).send({ message: err });
    }
}


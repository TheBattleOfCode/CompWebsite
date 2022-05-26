const generatedInOut = require("../models/generatedInOut.model"); 

exports.SaveInOut= (req, res) => {
    const InOut = new generatedInOut({
        genInput: req.body.genInput,
        genOutput: req.body.genOutput,
        userId : req.body.userId,
        problemId : req.body.problemId,
        answered:false
        
    })
    InOut.save((err, InOut) => {
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


exports.GetAllGenProbByProb = async (req, res) => {
    try{
        const InOut = await generatedInOut.find({problemId:req.params.problemId})
        res.send(InOut)

    }catch(err){
        res.status(500).send({ message: err });
    }
}

exports.GenUpdateInOut = async (req, res) => {

    try{
        const InOut = await generatedInOut.findOneAndUpdate({
            userId: req.params.userId,
            problemId: req.params.problemId
        },[{
            $set: { answered:  true, genOutput: req.params.answer }
        }],{
            new:true
        })

            return res.status(201).send({'success':true,message:'inOut Updated'})

    }catch(err){

        return res.status(500).send({ message: err })
    }

}

exports.DeleteInOut = async (req, res) => {
    try{
        const InOut = await generatedInOut.findOneAndDelete({_id:req.params.id}) 
        res.send({'success':true, message:'inOut deleted'})
    
    }catch(err){
        res.status(500).send({ message: err });
    }
}


const Problem = require("../models/problem.model");

exports.SaveProb= (req, res) => {
    const prob = new Problem({
        title: req.body.title,
        description: req.body.description,
        score: req.body.score,
        inOutContentGen: req.body.inOutContentGen,
        type: req.body.type
    })
    prob.save((err, prob) => {
        if (err) {
            return res.status(500).send({ message: err });
        }
        else{
            return res.status(201).send({'success':true,message:'Problrm Created'})
        }

  }
)}

exports.GetProbs = async (req, res) => {
    try{
        const prb = await Problem.find()
        res.send(prb)
    
    }catch(err){
        res.status(500).send({ message: err });
    }
}

exports.GetProb = async (req, res) => {
    const id = req.params.id
    try{
        const prb = await Problem.findById(id)
        res.send(prb)
    
    }catch(err){
        res.status(500).send({ message: err });
    }
}

exports.DeleteProb = async (req, res) => {
    const id = req.params.id
    try{
        const prb = await Problem.findByIdAndDelete(id)
        res.send({message: "Deleted problem"})
    
    }catch(err){
        res.status(500).send({ message: err });
    }
}



 
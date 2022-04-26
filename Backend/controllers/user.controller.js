const User = require("../models/user.model");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.UpdateUser = async (req, res) => {
  const oldUser = await User.findById(req.params.id)
    User.findOneAndUpdate({_id:req.params.id},[{
      $set: {
        firstName: req.body.firstName?req.body.firstName:oldUser.firstName,
        lastName: req.body.lastName?req.body.lastName:oldUser.lastName,
        phone: req.body.phone?req.body.phone:oldUser.phone,
        email: req.body.email?req.body.email:oldUser.email,
        password: req.body.password?req.body.password:oldUser.password,
        teamName: req.body.teamName?req.body.teamName: oldUser.teamName,
        indivScore: req.body.indivScore?req.body.indivScore: oldUser.indivScore,
        teamScore: req.body.teamScore?req.body.teamScore: oldUser.teamScore,
        country: req.body.country? req.body.country: oldUser.country,
        city: req.body.city? req.body.city: oldUser.city,
        organization: req.body.organization? req.body.organization: oldUser.organization,
      }
    }],{
      new:true
    })
    .then(user => {
      if(!user){
        return res.status(404).send({
          message: "User not found with id " + req.params.id
        });
      }
      res.send(user);
    }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with id " + req.params.id
        });                
      }
      return res.status(500).send({
        message: "Error updating user with id " + req.params.id
      });
    });
};
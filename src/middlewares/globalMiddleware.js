var validator = require("email-validator");
const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken")
 
const emailValidator=async function(req,res,next){
    let Id=req.body.email
    let Idd=validator.validate(Id);
    console.log(Idd)
    if(Idd){
        
        next();
    }else{
        res.status(404).send('Plz give valid email')
    }
}
const activityToken = async function (req, res, next) {
    try{
        let x=req.params.blogId
        let y=req.body.authorId
        let z= req.headers.author_id
        
    if(x || y || z){
    const b=await blogModel.findOne({$or:[{_id:x},{authorId:y},{authorId:z}]})
    let token = req.headers['x-api-key']

    let validtoken = jwt.verify(token, 'radium')
    if (validtoken) {
        if (validtoken.authorId ==b.authorId) {                                         
            req.validtoken = validtoken;       
            next()
        }
        else {
            res.status(403).send({ status: false, msg: "You are not authorised" })
        }
    }
    else {
        res.status(401).send({ status: false, msg: "The token is invalid" })
    }}
  } catch (err) {
    res.status(500).send({ msg: err });
  }
}

module.exports.activityToken=activityToken;
module.exports.emailValidator = emailValidator
var validator = require("email-validator");
const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken")
 
// validator.validate("test@email.com");

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
    if(x || y){
    const b=await blogModel.findOne({$or:[{_id:x},{authorId:y}]})
    let token = req.headers['x-api-key']
    let validtoken = jwt.verify(token, 'radium')
    if (validtoken) {
        if (validtoken.authorId ==b.authorId) {                                         //req.params.userId=> we are giving is in url i.e userId
            req.validtoken = validtoken;       //here we have created a key value pair=> key=validtoken and value=validtoken
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
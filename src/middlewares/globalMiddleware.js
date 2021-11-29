var validator = require("email-validator");
 
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

module.exports.emailValidator = emailValidator
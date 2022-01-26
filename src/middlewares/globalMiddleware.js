const validator = require("email-validator");
const jwt = require("jsonwebtoken")

const emailValidator = async function (req, res, next) {
    let Id = req.body.email
    let Idd = validator.validate(Id);
    if (Idd) {
        next();
    } else {
        res.status(404).send({ msg: "Plz give valid email" })
    }
}
const activityToken = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) {
            res.status(403).send({ status: false, msg: "Missing authentication token in the request part" });
        }
        let validtoken = jwt.verify(token, 'radium')
        if (!validtoken) {
            res.status(403).send({ status: false, msg: "The token is invalid" })
        }
        req.authorId = validtoken.authorId
        next();
    } catch (err) {
        res.status(500).send({ status: false, msg: "Internal Server Error", msg: err });
    }
}

module.exports.activityToken = activityToken;
module.exports.emailValidator = emailValidator;
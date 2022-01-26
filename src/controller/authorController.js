const jwt = require('jsonwebtoken')
const authorModel = require("../models/authorModel");

const isValidTitle = function (title) {
  return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

const createAuthor = async function (req, res) {
  try {
    const authorDetail = req.body;
    const { fname, lname, title, email, password } = authorDetail //object destructuring => becz it will be easy to use for checking perpuse now we can use "fname" in place of req.body.fname

    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, message: 'Please fill anyone of them-[Mr, Mrs, Miss, Mast]' })
    }
    const isEmailAlreadyUsed = await authorModel.findOne({ email }); // {email: email} object shorthand property

    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, message: `${email} email address is already registered` })
    }
    let createAuthor = { fname, lname, title, email, password }; //this is done becz to have only those feild which passes the above criteria and put all those feild into a object.
    let savedAuthor = await authorModel.create(createAuthor);
    res.status(201).send({ status: true, message: "Author created successfully", data: savedAuthor });
  }
  catch (error) {
    console.log({ ErrorIs: error.message })
    res.status(500).send({ status: false, msg: "Something went wrong", Errormsg: error.message })
  }
};

//Login Author-->

const loginforblog = async function (req, res) {
  try {
    let loginbody = req.body;
    const { email, password } = loginbody

    const User = await authorModel.findOne({ email, password, isDeleted: false });
    if (!User) {
      return res.status(401).send({ status: false, msg: "invalid name or password" });
    }

    let payload = {
      authorId: User._id,
      iat: Math.floor(Date.now() / 1000), //	The iat (issued at) identifies the time at which the JWT was issued. [Date.now() / 1000 => means it will give time that is in seconds(for January 1, 1970)] (abhi ka time de gha jab bhi yhe hit hoga)
      exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60 //The exp (expiration time) identifies the expiration time on or after which the token MUST NOT be accepted for processing.   (abhi ke time se 10 ganta tak jalee gha ) Date.now() / 1000=> seconds + 60x60min i.e 1hr and x10 gives 10hrs.
    };

    let token = jwt.sign(payload, "radium");

    res.header("x-api-key", token);

    res.status(200).send({ status: true, message: "Author is loged in successfully", data: token });
  } catch (error) {
    res.status(500).send({ status: false, msg: "Something went wrong", message: error.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginforblog = loginforblog;

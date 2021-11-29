const mongoose = require("mongoose");
const authorModel = require("../models/authorModel");

const createAuthor= async function (req, res) {
  const author = req.body
  // const email=req.body.email
  let savedAuthor = await authorModel.create(author);

  res.send({ msg: savedAuthor });
};

module.exports.createAuthor=createAuthor;
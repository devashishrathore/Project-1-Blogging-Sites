const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./routes/route.js");
const gbMiddleware = require("./middlewares/globalMiddleware");

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/", route);
app.use(gbMiddleware.captureInfo);




mongoose
  .connect(
    "mongodb+srv://monty-python:SnYUEY4giV9rekw@functionup-backend-coho.0zpfv.mongodb.net/RaviKantKannaujiya123_db?authSource=admin&replicaSet=atlas-60843q-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongodb running and connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

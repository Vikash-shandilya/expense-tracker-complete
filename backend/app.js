const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database/databse");

const userroute = require("./router/userroute");

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.use(userroute);

app.use("/", (req, res, next) => {
  res.send("app in the making");
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database/databse");

const userroute = require("./router/userroute");
const expenseroute = require("./router/expenserouter");

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.use(userroute);
app.use(expenseroute);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

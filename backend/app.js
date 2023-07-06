const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const sequelize = require("./database/databse");

const userroute = require("./router/userroute");
const expenseroute = require("./router/expenserouter");
const orderroute = require("./router/orderroute");
const leaderroute = require("./router/leaderboard");

const expensesmodel = require("./model/expense");
const usermodel = require("./model/user");
const ordermodel = require("./model/order");
const order = require("./model/order");

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.use(userroute);
app.use(expenseroute);
app.use(orderroute);
app.use(leaderroute);

usermodel.hasMany(expensesmodel);
expensesmodel.belongsTo(usermodel);

usermodel.hasMany(ordermodel);
ordermodel.belongsTo(usermodel);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgon = require("morgan");
const fs = require("fs");
const path = require("path");

const configloader = require("./configloader");
configloader(); //this will load the config file
const environment = "development"; // Change based on your environment
const config = JSON.parse(process.env.CONFIG);

const sequelize = require("./database/databse");

const userroute = require("./router/userroute");
const expenseroute = require("./router/expenserouter");
const orderroute = require("./router/orderroute");
const leaderroute = require("./router/leaderboard");
const premiumroute = require("./router/premumroute");
const downloadroute = require("./router/downloadroute");

const expensesmodel = require("./model/expense");
const usermodel = require("./model/user");
const ordermodel = require("./model/order");
const order = require("./model/order");
const forgotpasstable = require("./model/forgotpass");
const downloadmodel = require("./model/downloadmodel");

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyparser.json());
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgon("combined", { stream: logStream }));

app.use(userroute);
app.use(expenseroute);
app.use(orderroute);
app.use(leaderroute);
app.use(premiumroute);
app.use(downloadroute);
usermodel.hasMany(expensesmodel);
expensesmodel.belongsTo(usermodel);

usermodel.hasMany(ordermodel);
ordermodel.belongsTo(usermodel);

usermodel.hasMany(forgotpasstable);
forgotpasstable.belongsTo(usermodel);

usermodel.hasMany(downloadmodel);
downloadmodel.belongsTo(usermodel);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

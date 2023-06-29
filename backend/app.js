const express = require("express");

const app = express();

app.get("/", (req, res, next) => {
  res.send("app in the making");
});
app.post("/user/signup", (req, res, next) => {
  res.send("you are done");
});

app.listen(3000);

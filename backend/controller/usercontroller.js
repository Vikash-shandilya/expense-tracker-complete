const user = require("../model/user");

exports.submitform = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const password = req.body.password;
  const userfind = await user.findOne({ where: { email: email } });
  if (userfind) {
    res.json({ res: "this user already exist" });
  } else {
    user.create({
      name: name,
      email: email,
      phone_number: phone_number,
      password: password,
    });
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userfind = await user.findOne({ where: { email: email } });
  console.log(userfind);
  if (userfind) {
    if (
      userfind.dataValues.email === email &&
      userfind.dataValues.password === password
    ) {
      res.json("login sucessfull");
    } else if (userfind.dataValues.password !== password) {
      res.json("password does not match");
    }
  } else {
    res.json("user does not find");
  }
};

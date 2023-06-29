const user = require("../model/user");
const bcrypt = require("bcrypt");

exports.submitform = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const password = req.body.password;
  const userfind = await user.findOne({ where: { email: email } });
  if (userfind) {
    res.json({ res: "this user already exist" });
  } else {
    const hashedpassword = await bcrypt.hash(password, 10);
    user.create({
      name: name,
      email: email,
      phone_number: phone_number,
      password: hashedpassword,
    });
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userfind = await user.findOne({ where: { email: email } });
  console.log(userfind);
  if (userfind) {
    const passwordMatch = bcrypt.compare(
      password,
      userfind.dataValues.password
    );
    if (email === userfind.dataValues.email && passwordMatch) {
      res.json("you are logged in ");
    } else {
      res.json("your email or password is wrong");
    }
  } else {
    res.json("user does not find");
  }
};

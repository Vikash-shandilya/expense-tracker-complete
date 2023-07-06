const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret_key = "vikashkumarjha";
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
    user
      .create({
        name: name,
        email: email,
        phone_number: phone_number,
        password: hashedpassword,
      })
      .then((res) => {
        console.log(res);
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
      const id = userfind.dataValues.id;

      console.log(userfind.dataValues.ispremium, "ispremium");
      const token = jwt.sign({ id }, secret_key);
      res.json({
        token: token,
        islogin: true,
        ispremium: userfind.dataValues.ispremium,
      }); //send this token to backend to save in localstorage
    } else {
      res.json("your email or password is wrong");
    }
  } else {
    res.json("user does not find");
  }
};

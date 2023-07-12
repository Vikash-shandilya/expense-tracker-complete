const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendinblue = require("@getbrevo/brevo");

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

exports.passwordreset = async (req, res, next) => {
  try {
    const email = req.body.email;
    let userfound = await user.findOne({ where: { email: email } });
    console.log(userfound);
    if (userfound) {
      const defaultClient = sendinblue.ApiClient.instance;
      console.log(defaultClient, "defaultclient");
      defaultClient.authentications["api-key"].apiKey =
        "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";

      const apiInstance = new sendinblue.TransactionalEmailsApi();
      const sendSmtpEmail = new sendinblue.SendSmtpEmail();
      sendSmtpEmail.sender = {
        name: "vikash",
        email: "vikashjha041@gmail.com",
      };
      sendSmtpEmail.to = [{ email: email }];
      sendSmtpEmail.subject = "Password Reset";
      sendSmtpEmail.textContent =
        "Click the following link to reset your password: [RESET_LINK]";
      let response = await apiInstance.sendTransacEmail(sendSmtpEmail);

      res.json(response);
    } else {
      res.json("user does not found");
    }
  } catch (error) {
    console.log(error);
    res.json("failed in sending reset link");
  }
};

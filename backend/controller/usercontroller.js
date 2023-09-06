const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendinblue = require("@getbrevo/brevo");
const forgotpasstable = require("../model/forgotpass");

const environment = "development"; // Change based on your environment
const config = JSON.parse(process.env.CONFIG);

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
    const passwordMatch = await bcrypt.compare(
      password,
      userfind.dataValues.password
    );
    console.log(passwordMatch, "passmatch");
    console.log(userfind.dataValues, "userfind");
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

    if (userfound) {
      const newrow = await forgotpasstable.create({
        userId: userfound.dataValues.id,
        isActive: true,
      });
      await newrow.save();
      const defaultClient = sendinblue.ApiClient.instance;

      const token = await generatetoken(userfound.dataValues.id);

      defaultClient.authentications["api-key"].apiKey =
        config[environment].sendinblue_api_key;

      const apiInstance = new sendinblue.TransactionalEmailsApi();
      const sendSmtpEmail = new sendinblue.SendSmtpEmail();
      sendSmtpEmail.sender = {
        name: "vikash",
        email: "vikashjha041@gmail.com",
      };
      sendSmtpEmail.to = [{ email: email }];
      sendSmtpEmail.subject = "Password Reset";
      sendSmtpEmail.htmlContent = `Click the following link to reset your password:
  <a href="file:///C:/Users/vikash/Desktop/sharpener/expense-tracker-full/frontend/updatepasswordform.html?token=${token}" >Reset Password</a>`;

      let response = await apiInstance.sendTransacEmail(sendSmtpEmail);

      res.json({
        response: response,
        token: token,
        url: `file:///C:/Users/vikash/Desktop/sharpener/expense-tracker-full/frontend/updatepasswordform.html?token=${token}`,
      });
    } else {
      res.json("user does not found");
    }
  } catch (error) {
    console.log(error);
    res.json("failed in sending reset link");
  }
};

async function generatetoken(id) {
  const usertoken = await forgotpasstable.findOne({
    where: { userId: id, isActive: true },
  });

  return usertoken.id;
}

exports.passwordresetfinal = async (req, res, next) => {
  const token = req.params.token;
  const newpassword = req.body.password;

  const ifExist = await forgotpasstable.findOne({
    where: { id: token, isActive: true },
  });

  if (ifExist.isActive) {
    const userid = ifExist.userId;
    const userdetails = await user.findOne({ where: { id: userid } });
    const changedpassword = await bcrypt.hash(newpassword, 10);
    userdetails.password = changedpassword;
    console.log(changedpassword, "changedpass");
    await userdetails.save();
  }
  ifExist.isActive = false;
  await ifExist.save();
  res.json("password reset successfull");
};

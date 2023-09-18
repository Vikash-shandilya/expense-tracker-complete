const secret_key = "vikashkumarjha";
const jwt = require("jsonwebtoken");

exports.authtoken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  console.log(token);
  console.log(req.user, "hello");
  if (!token) {
    return res.status(401).json("Token not provided");
  } else {
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        return res.status(403).json("Failed to authenticate");
      }
      console.log(decoded.id, "hii");
      req.user = {};
      req.user.id = decoded.id;
      next();
    });
  }
};

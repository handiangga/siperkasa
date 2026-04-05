const jwt = require("jsonwebtoken");

const jwtSign = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "3h",
  });
};

const jwtVerify = (access_token) => {
  try {
    return jwt.verify(access_token, process.env.SECRET_KEY);
  } catch (error) {
    throw { name: "Unauthorized", message: "Invalid token" };
  }
};

module.exports = { jwtSign, jwtVerify };

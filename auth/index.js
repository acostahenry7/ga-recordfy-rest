const jwt = require("jsonwebtoken");
const config = require("../config");
const error = require("../utils/error");

function sign(payload) {
  return jwt.sign(payload, config.security.secret, { expiresIn: "30m" });
}

function verifyToken(req, res, next) {
  let token = req.headers.authorization;

  if (token?.split(" ").length > 1) {
    token = token.split(" ")[1];
  }

  jwt.verify(token, config.security.secret, (err, decoded) => {
    if (err) {
      throw error(err.message, 401);
    }

    next();
  });
}

function decodeToken(token) {
  if (token?.split(" ").length > 1) {
    token = token.split(" ")[1];
  }
  return jwt.decode(token);
}

module.exports = {
  sign,
  verifyToken,
  decodeToken,
};

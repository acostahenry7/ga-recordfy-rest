const jwt = require("jsonwebtoken");
const config = require("../config");
const error = require("../utils/error");

function sign(payload) {
  return jwt.sign(payload, config.security.secret, { expiresIn: "15s" });
}

function verify(token) {
  jwt.verify(token, config.security.secret, (err, decoded) => {
    if (err) {
      throw error(err.message, 401);
    }

    return decoded;
  });
}

module.exports = {
  sign,
  verify,
};
